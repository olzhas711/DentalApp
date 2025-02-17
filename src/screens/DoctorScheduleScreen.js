import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const DoctorScheduleScreen = () => {
  const { user } = useAuth();
  const { getDoctorAppointments, updateAppointmentStatus } = useAppointments();
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);

  // Используем useEffect для загрузки записей
  useEffect(() => {
    if (user) {
      setAppointments(getDoctorAppointments(user.email));
    }
  }, [user, getDoctorAppointments]);

  // Если пользователь не авторизован, показываем экран авторизации
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Необходима авторизация</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.buttonText}>Войти</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleConfirm = (id) => {
    Alert.alert(
      'Подтверждение',
      'Вы хотите подтвердить эту запись?',
      [
        {
          text: 'Отмена',
          style: 'cancel'
        },
        {
          text: 'Подтвердить',
          onPress: () => {
            updateAppointmentStatus(id, 'confirmed');
            Alert.alert('Успешно', 'Запись подтверждена');
          }
        }
      ]
    );
  };

  const handleCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    if (selectedAppointment) {
      updateAppointmentStatus(selectedAppointment.id, 'cancelled', cancelReason);
      setShowCancelDialog(false);
      setCancelReason('');
      setSelectedAppointment(null);
    }
  };

  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'confirmed' && styles.statusConfirmed,
          item.status === 'cancelled' && styles.statusCancelled
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'pending' && 'Ожидает'}
            {item.status === 'confirmed' && 'Подтверждено'}
            {item.status === 'cancelled' && 'Отменено'}
          </Text>
        </View>
      </View>
      <Text style={styles.appointmentTime}>
        {formatDisplayDate(item.date)} {item.time}
      </Text>
      <Text style={styles.serviceType}>{item.service}</Text>
      {item.status === 'pending' && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.confirmButton]}
            onPress={() => handleConfirm(item.id)}
          >
            <Text style={styles.buttonText}>Подтвердить</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => handleCancel(item)}
          >
            <Text style={styles.buttonText}>Отменить</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity 
        style={styles.chatButton}
        onPress={() => navigation.navigate('Chat', { 
          recipient: {
            email: item.patientId,
            name: item.patientName
          }
        })}
      >
        <Icon name="chat" size={20} color="#007AFF" />
        <Text style={styles.chatButtonText}>Чат с пациентом</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Добро пожаловать, {user?.name}</Text>
      <Text style={styles.title}>Расписание приёмов</Text>
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Нет записей на приём</Text>
          </View>
        }
      />
      
      <Modal
        visible={showCancelDialog}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Отмена записи</Text>
            <TextInput
              style={styles.input}
              placeholder="Причина отмены (необязательно)"
              value={cancelReason}
              onChangeText={setCancelReason}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCancelDialog(false);
                  setCancelReason('');
                }}
              >
                <Text style={styles.buttonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmCancel}
              >
                <Text style={styles.buttonText}>Подтвердить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  welcomeText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  appointmentCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appointmentTime: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  serviceType: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#28a745',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: '#28a745',
  },
  statusCancelled: {
    backgroundColor: '#dc3545',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
  },
  chatButtonText: {
    color: '#007AFF',
    marginLeft: 8,
    fontSize: 14,
  },
});

export default DoctorScheduleScreen; 
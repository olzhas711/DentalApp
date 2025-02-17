import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useChat } from '../context/ChatContext';

const PatientAppointmentsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { getPatientAppointments } = useAppointments();
  const chat = useChat();
  const [appointments, setAppointments] = useState([]);

  // Используем useEffect для загрузки записей
  useEffect(() => {
    if (user) {
      setAppointments(getPatientAppointments(user.email));
    }
  }, [user, getPatientAppointments]);

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

  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#ffd700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Подтверждено';
      case 'cancelled': return 'Отменено';
      default: return 'Ожидает подтверждения';
    }
  };

  const renderAppointment = ({ item }) => {
    const unreadCount = chat.getUnreadCount(user.email, item.doctorId);
    
    return (
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <Text style={styles.doctorName}>{item.doctorName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
        <Text style={styles.appointmentTime}>{formatDisplayDate(item.date)} {item.time}</Text>
        <Text style={styles.serviceType}>{item.service}</Text>
        {item.status === 'cancelled' && item.cancelReason && (
          <View style={styles.cancelReasonContainer}>
            <Text style={styles.cancelReasonLabel}>Причина отмены:</Text>
            <Text style={styles.cancelReasonText}>{item.cancelReason}</Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => {
            navigation.navigate('Chat', { 
              recipient: {
                email: item.doctorId,
                name: item.doctorName
              }
            });
          }}
        >
          <View style={styles.chatIconContainer}>
            <Icon name="chat" size={20} color="#007AFF" />
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.chatButtonText}>Чат с врачом</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои записи</Text>
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>У вас пока нет записей</Text>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => navigation.navigate('Запись')}
            >
              <Text style={styles.bookButtonText}>Записаться на прием</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  appointmentTime: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  serviceType: {
    fontSize: 16,
    color: '#007AFF',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelReasonContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f8d7da',
    borderRadius: 4,
  },
  cancelReasonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#721c24',
  },
  cancelReasonText: {
    fontSize: 14,
    color: '#721c24',
    marginTop: 4,
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
  chatIconContainer: {
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default PatientAppointmentsScreen; 
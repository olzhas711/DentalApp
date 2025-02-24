import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker'; // Установите эту библиотеку, если еще не установлена
import axios from 'axios'; // Уже установлен в проекте

const services = [
  {
    id: 'service1',
    name: 'Чистка зубов',
    description: 'Профессиональная чистка зубов для поддержания здоровья полости рта.',
    price: '$100',
    image: require('../assets/service1.png'),
  },
  {
    id: 'service2',
    name: 'Имплантация',
    description: 'Установка зубных имплантатов для восстановления утраченных зубов.',
    price: '$2000',
    image: require('../assets/service2.png'),
  },
];

const ServicesScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Пример занятых слотов (можно заменить на данные из API)
  const bookedSlots = [
    '2025-02-22T10:00:00', // Занято 22 февраля в 10:00
    '2025-02-22T11:00:00', // Занято 22 февраля в 11:00
  ];

  const fetchAvailableTimes = async (date) => {
    setLoading(true);
    setError(null);
    try {
      // Здесь можно добавить запрос к API для получения доступных слотов
      // Пример: const response = await axios.get(`http://91.244.163.22:5000/api/appointments/available?date=${date.toISOString().split('T')[0]}`);
      const formattedDate = date.toISOString().split('T')[0]; // Формат даты: "2025-02-22"
      const times = generateTimeSlots(formattedDate);
      setAvailableTimes(times.filter(time => !bookedSlots.some(slot => slot.startsWith(formattedDate) && slot.endsWith(time))));
    } catch (error) {
      console.error('Ошибка загрузки доступных слотов:', error);
      setError('Не удалось загрузить доступные слоты. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = (date) => {
    const slots = [];
    let hour = 9; // Начало рабочего дня в 9:00
    while (hour < 17) { // Конец рабочего дня в 17:00
      slots.push(`${hour}:00:00`);
      hour++;
    }
    return slots;
  };

  const handleBookAppointment = () => {
    if (!user) {
      // Если пользователь не авторизован — предложение войти или зарегистрироваться
      navigation.navigate('Auth', { isRegistration: false });
      return;
    }
    // Если авторизован — открываем модальное окно для выбора даты и времени
    setModalVisible(true);
    fetchAvailableTimes(new Date());
  };

  const handleConfirmAppointment = () => {
    if (selectedDate && selectedTime) {
      // Логика подтверждения записи (например, отправка на сервер)
      Alert.alert('Успех', `Запись на ${selectedDate.toLocaleDateString()} в ${selectedTime} подтверждена!`);
      setModalVisible(false);
      setSelectedDate(new Date());
      setSelectedTime(null);
    } else {
      Alert.alert('Ошибка', 'Пожалуйста, выберите дату и время.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {services.map((service) => (
        <View key={service.id} style={styles.serviceContainer}>
          <Image source={service.image} style={styles.serviceImage} />
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDescription}>{service.description}</Text>
          <Text style={styles.servicePrice}>{service.price}</Text>
          <TouchableOpacity style={styles.appointmentButton} onPress={() => handleBookAppointment()}>
            <Text style={styles.appointmentButtonText}>Записаться</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Выберите дату и время</Text>
            
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setSelectedDate(date);
                fetchAvailableTimes(date);
              }}
            />

            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <FlatList
                data={availableTimes}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.timeSlot,
                      selectedTime === item && styles.selectedTimeSlot,
                      bookedSlots.some(slot => slot.endsWith(item)) && styles.disabledTimeSlot,
                    ]}
                    onPress={() => {
                      if (!bookedSlots.some(slot => slot.endsWith(item))) {
                        setSelectedTime(item);
                      }
                    }}
                    disabled={bookedSlots.some(slot => slot.endsWith(item))}
                  >
                    <Text style={styles.timeSlotText}>{item.slice(0, -3)}</Text> {/* Убираем секунды */}
                  </TouchableOpacity>
                )}
                numColumns={2}
                contentContainerStyle={styles.timeSlotsContainer}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmAppointment}
              >
                <Text style={styles.confirmButtonText}>Подтвердить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5FCFF',
  },
  serviceContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 10,
  },
  appointmentButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  appointmentButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  timeSlotsContainer: {
    paddingVertical: 10,
  },
  timeSlot: {
    backgroundColor: '#E6F7FF',
    padding: 10,
    borderRadius: 8,
    margin: 5,
    alignItems: 'center',
    flex: 1,
  },
  selectedTimeSlot: {
    backgroundColor: '#4CAF50',
  },
  disabledTimeSlot: {
    backgroundColor: '#D3D3D3',
    opacity: 0.7,
  },
  timeSlotText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ServicesScreen;
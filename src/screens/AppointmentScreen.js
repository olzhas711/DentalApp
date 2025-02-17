import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const doctors = [
  { 
    id: 'doctor@test.com', 
    name: 'Др. Иван Иванов', 
    specialization: 'Стоматолог-терапевт' 
  },
  { 
    id: 'doctor2@test.com', 
    name: 'Др. Мария Петрова', 
    specialization: 'Ортодонт' 
  }
];

const timeSlots = [
  '9:00', '10:00', '11:00', '12:00', 
  '14:00', '15:00', '16:00', '17:00'
];

const formatDateDisplay = (date) => {
  return date.toLocaleDateString('ru-RU', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  });
};

const AppointmentScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { addAppointment, appointments } = useAppointments();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Добавим отладочную информацию
  console.log('Selected Doctor:', selectedDoctor);
  console.log('Selected Date:', selectedDate);
  console.log('Selected Time:', selectedTime);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleBookAppointment = async () => {
    if (selectedDoctor && selectedDate && selectedTime) {
      const appointment = {
        patientName: user.name || 'Неизвестный пациент',
        patientId: user.email,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: formatDate(selectedDate),
        time: selectedTime,
        service: `Консультация (${selectedDoctor.specialization})`
      };

      try {
        await addAppointment(appointment);
        Alert.alert('Успешно', 'Запись создана! Ожидайте подтверждения врача.');
        navigation.goBack();
      } catch (error) {
        Alert.alert('Ошибка', error.message);
      }
    } else {
      Alert.alert('Ошибка', 'Пожалуйста, выберите врача, дату и время');
    }
  };

  const getBookedTimeSlots = (date) => {
    if (!selectedDoctor) return [];
    return appointments
      .filter(app => 
        app.doctorId === selectedDoctor.id && 
        app.date === formatDate(date) &&
        app.status !== 'cancelled'
      )
      .map(app => app.time);
  };

  const renderTimeSlot = (time) => {
    const isBooked = selectedDate && getBookedTimeSlots(selectedDate).includes(time);
    return (
      <TouchableOpacity
        key={time}
        style={[
          styles.timeCard,
          selectedTime === time && styles.selectedCard,
          isBooked && styles.bookedCard
        ]}
        onPress={() => !isBooked && setSelectedTime(time)}
        disabled={isBooked}
      >
        <Text style={[
          styles.timeText,
          selectedTime === time && styles.selectedText,
          isBooked && styles.bookedText
        ]}>{time}</Text>
      </TouchableOpacity>
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Icon name="event-busy" size={100} color="#007AFF" />
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Запись на прием</Text>
      
      {/* Добавим отображение выбранных значений */}
      <View style={styles.debugInfo}>
        <Text>Выбранный врач: {selectedDoctor?.name || 'Не выбран'}</Text>
        <Text>Выбранная дата: {selectedDate ? formatDateDisplay(selectedDate) : 'Не выбрана'}</Text>
        <Text>Выбранное время: {selectedTime || 'Не выбрано'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Выберите врача:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.doctorsContainer}>
          {doctors.map(doctor => (
            <TouchableOpacity
              key={doctor.id}
              style={[
                styles.doctorCard,
                selectedDoctor?.id === doctor.id && styles.selectedCard
              ]}
              onPress={() => setSelectedDoctor(doctor)}
            >
              <Icon name="person" size={40} color={selectedDoctor?.id === doctor.id ? 'white' : '#007AFF'} />
              <Text style={[
                styles.doctorName,
                selectedDoctor?.id === doctor.id && styles.selectedText
              ]}>{doctor.name}</Text>
              <Text style={[
                styles.doctorSpecialization,
                selectedDoctor?.id === doctor.id && styles.selectedText
              ]}>{doctor.specialization}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Text style={styles.sectionTitle}>Выберите дату:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.datesContainer}>
          {getNextWeekDates().map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateCard,
                selectedDate && date.toDateString() === selectedDate.toDateString() && styles.selectedCard
              ]}
              onPress={() => {
                console.log('Date selected:', date);
                setSelectedDate(date);
              }}
            >
              <Text style={[
                styles.dateText,
                selectedDate && date.toDateString() === selectedDate.toDateString() && styles.selectedText
              ]}>{formatDateDisplay(date)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Text style={styles.sectionTitle}>Выберите время:</Text>
      <ScrollView horizontal style={styles.timesContainer}>
        {timeSlots.map(time => renderTimeSlot(time))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.bookButton}
        onPress={handleBookAppointment}
      >
        <Text style={styles.bookButtonText}>Записаться на прием</Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: 24,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    color: '#333',
  },
  doctorsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  doctorCard: {
    width: 150,
    padding: 16,
    marginRight: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  doctorSpecialization: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  datesContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  dateCard: {
    padding: 12,
    marginRight: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  timeCard: {
    padding: 12,
    margin: 4,
    backgroundColor: 'white',
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
  },
  selectedCard: {
    backgroundColor: '#007AFF',
  },
  selectedText: {
    color: 'white',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugInfo: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
    borderRadius: 8,
  },
  bookedCard: {
    backgroundColor: '#e9ecef',
    borderColor: '#dee2e6',
  },
  bookedText: {
    color: '#6c757d',
  },
});

export default AppointmentScreen; 
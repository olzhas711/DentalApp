import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppointmentContext = createContext();

// Тестовые записи
const INITIAL_APPOINTMENTS = [
  {
    id: '1',
    patientName: 'Анна Сидорова',
    patientId: 'client@test.com',
    doctorId: 'doctor@test.com',
    doctorName: 'Др. Сергей Иванов',
    time: '10:00',
    date: '2024-03-20',
    service: 'Консультация',
    status: 'pending'
  },
  {
    id: '2',
    patientName: 'Иван Петров',
    patientId: 'client@test.com',
    doctorId: 'doctor@test.com',
    doctorName: 'Др. Сергей Иванов',
    time: '11:30',
    date: '2024-03-20',
    service: 'Чистка зубов',
    status: 'confirmed'
  }
];

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  // Загрузка записей при старте
  React.useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const savedAppointments = await AsyncStorage.getItem('appointments');
      if (savedAppointments) {
        setAppointments(JSON.parse(savedAppointments));
      } else {
        // Загружаем тестовые записи только если нет сохраненных
        setAppointments(INITIAL_APPOINTMENTS);
        await AsyncStorage.setItem('appointments', JSON.stringify(INITIAL_APPOINTMENTS));
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const saveAppointments = async (newAppointments) => {
    try {
      await AsyncStorage.setItem('appointments', JSON.stringify(newAppointments));
    } catch (error) {
      console.error('Error saving appointments:', error);
    }
  };

  const addAppointment = async (appointment) => {
    // Проверка на занятое время
    const isTimeSlotTaken = appointments.some(
      app => app.doctorId === appointment.doctorId && 
             app.date === appointment.date && 
             app.time === appointment.time &&
             app.status !== 'cancelled'
    );

    if (isTimeSlotTaken) {
      throw new Error('Это время уже занято. Пожалуйста, выберите другое время.');
    }

    const newAppointments = [
      ...appointments,
      {
        id: Date.now().toString(),
        status: 'pending',
        ...appointment
      }
    ];
    
    setAppointments(newAppointments);
    await saveAppointments(newAppointments);
  };

  const updateAppointmentStatus = async (id, status, cancelReason = '') => {
    const newAppointments = appointments.map(appointment =>
      appointment.id === id
        ? { ...appointment, status, cancelReason }
        : appointment
    );
    
    setAppointments(newAppointments);
    await saveAppointments(newAppointments);
  };

  const getPatientAppointments = (patientId) => {
    if (!patientId) return [];
    return appointments
      .filter(app => app.patientId === patientId)
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA - dateB;
      });
  };

  const getDoctorAppointments = (doctorId) => {
    if (!doctorId) return [];
    return appointments
      .filter(app => app.doctorId === doctorId)
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA - dateB;
      });
  };

  const value = {
    appointments,
    addAppointment,
    updateAppointmentStatus,
    getPatientAppointments,
    getDoctorAppointments
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  return useContext(AppointmentContext);
}; 
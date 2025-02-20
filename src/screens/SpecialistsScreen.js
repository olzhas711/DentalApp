import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

const doctors = [
  {
    id: 'doctor@test.com',
    name: 'Др. Иван Иванов',
    specialization: 'Стоматолог-терапевт',
    experience: '10 лет опыта',
    image: require('../assets/doctor1.png'),
  },
  {
    id: 'doctor2@test.com',
    name: 'Др. Мария Петрова',
    specialization: 'Ортодонт',
    experience: '8 лет опыта',
    image: require('../assets/doctor2.png'),
  },
];

const SpecialistsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {doctors.map((doctor) => (
        <View key={doctor.id} style={styles.doctorContainer}>
          <Image source={doctor.image} style={styles.doctorImage} />
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialization}>{doctor.specialization}</Text>
          <Text style={styles.doctorExperience}>{doctor.experience}</Text>
          <TouchableOpacity style={styles.appointmentButton}>
            <Text style={styles.appointmentButtonText}>Записаться на прием</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5FCFF',
  },
  doctorContainer: {
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
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  doctorSpecialization: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
  },
  doctorExperience: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  appointmentButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  appointmentButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SpecialistsScreen;

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

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
  return (
    <ScrollView style={styles.container}>
      {services.map((service) => (
        <View key={service.id} style={styles.serviceContainer}>
          <Image source={service.image} style={styles.serviceImage} />
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDescription}>{service.description}</Text>
          <Text style={styles.servicePrice}>{service.price}</Text>
          <TouchableOpacity style={styles.appointmentButton}>
            <Text style={styles.appointmentButtonText}>Записаться</Text>
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
});

export default ServicesScreen;

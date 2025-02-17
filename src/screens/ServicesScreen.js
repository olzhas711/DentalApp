import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const services = [
  {
    id: '1',
    name: 'Профессиональная чистка',
    description: 'Профессиональная гигиена полости рта',
    price: '3000 ₽'
  },
  {
    id: '2',
    name: 'Отбеливание зубов',
    description: 'Профессиональное отбеливание',
    price: '15000 ₽'
  },
  {
    id: '3',
    name: 'Лечение кариеса',
    description: 'Лечение кариеса любой сложности',
    price: 'от 4000 ₽'
  },
  {
    id: '4',
    name: 'Установка брекетов',
    description: 'Исправление прикуса',
    price: 'от 30000 ₽'
  }
];

const ServicesScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.serviceItem}>
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      <Text style={styles.servicePrice}>{item.price}</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={services}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  serviceItem: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  serviceDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    lineHeight: 22,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default ServicesScreen; 
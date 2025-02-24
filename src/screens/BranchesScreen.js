import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BranchesScreen = () => {
  const navigation = useNavigation();

  // Список филиалов (статические данные, можно заменить на API)
  const branches = [
    {
      id: 1,
      name: 'Филиал 1 - Москва',
      address: 'г. Москва, ул. Ленина, 10',
      phone: '+7 (495) 123-45-67',
    },
    {
      id: 2,
      name: 'Филиал 2 - Санкт-Петербург',
      address: 'г. Санкт-Петербург, пр. Невский, 15',
      phone: '+7 (812) 234-56-78',
    },
    {
      id: 3,
      name: 'Филиал 3 - Казань',
      address: 'г. Казань, ул. Баумана, 20',
      phone: '+7 (843) 345-67-89',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Наши филиалы</Text>
      
      {branches.map((branch) => (
        <View key={branch.id} style={styles.branchCard}>
          <Text style={styles.branchName}>{branch.name}</Text>
          <Text style={styles.branchAddress}>{branch.address}</Text>
          <Text style={styles.branchPhone}>Телефон: {branch.phone}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>Закрыть</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007AFF',
  },
  branchCard: {
    backgroundColor: '#E6F7FF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Для Android
  },
  branchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  branchAddress: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  branchPhone: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BranchesScreen;
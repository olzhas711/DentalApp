import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PromotionsDetailScreen = () => {
  const navigation = useNavigation();

  const promotions = [
    { id: 1, title: "Скидка 20%", description: "На чистку зубов", validUntil: "2025-03-31" },
    { id: 2, title: "Бесплатная консультация", description: "Ортодонт", validUntil: "2025-04-15" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Детали акций</Text>
      
      {promotions.map((promo) => (
        <View key={promo.id} style={styles.promotionCard}>
          <Text style={styles.promotionTitle}>{promo.title}</Text>
          <Text style={styles.promotionDescription}>{promo.description}</Text>
          <Text style={styles.promotionValid}>Действует до: {promo.validUntil}</Text>
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
  promotionCard: {
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
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  promotionDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  promotionValid: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
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

export default PromotionsDetailScreen;
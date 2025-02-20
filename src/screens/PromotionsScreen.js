import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

const promotions = [
  {
    id: 'promo1',
    name: 'Скидка 20% на все услуги',
    description: 'Специальное предложение до конца месяца.',
    image: require('../assets/promo1.png'),
  },
  {
    id: 'promo2',
    name: 'Бесплатная консультация',
    description: 'Получите бесплатную консультацию у наших специалистов.',
    image: require('../assets/promo2.png'),
  },
];

const PromotionsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {promotions.map((promotion) => (
        <View key={promotion.id} style={styles.promotionContainer}>
          <Image source={promotion.image} style={styles.promotionImage} />
          <Text style={styles.promotionName}>{promotion.name}</Text>
          <Text style={styles.promotionDescription}>{promotion.description}</Text>
          <TouchableOpacity style={styles.learnMoreButton}>
            <Text style={styles.learnMoreButtonText}>Узнать больше</Text>
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
  promotionContainer: {
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
  promotionImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  promotionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  promotionDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  learnMoreButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  learnMoreButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PromotionsScreen;

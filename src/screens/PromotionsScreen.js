import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const promotions = [
  {
    id: '1',
    title: 'Скидка 20% на профессиональную чистку',
    description: 'Действует до конца месяца',
  },
  {
    id: '2',
    title: 'Бесплатная консультация ортодонта',
    description: 'При первом посещении клиники',
  },
  {
    id: '3',
    title: 'Отбеливание со скидкой 30%',
    description: 'Акция действует по выходным',
  },
  {
    id: '4',
    title: 'Комплексная диагностика',
    description: 'Полное обследование полости рта за 2500₽',
  },
  {
    id: '5',
    title: 'Семейная скидка 15%',
    description: 'При лечении всей семьей',
  }
];

const PromotionsScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.promotionItem}>
      <Text style={styles.promotionTitle}>{item.title}</Text>
      <Text style={styles.promotionDescription}>{item.description}</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={promotions}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  promotionItem: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  promotionDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default PromotionsScreen; 
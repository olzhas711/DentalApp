import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

const products = [
  {
    id: '1',
    name: 'Зубная щетка Premium',
    price: '500 ₽',
    image: require('../assets/toothbrush.png'),
    description: 'Профессиональная зубная щетка',
  },
  {
    id: '2',
    name: 'Ирригатор Dental Pro',
    price: '3500 ₽',
    image: require('../assets/irrigator.png'),
    description: 'Профессиональный уход за полостью рта',
  },
  {
    id: '3',
    name: 'Набор для отбеливания',
    price: '2000 ₽',
    image: require('../assets/whitening_kit.png'),
    description: 'Безопасное отбеливание в домашних условиях',
  },
  {
    id: '4',
    name: 'Зубная паста Dental White',
    price: '350 ₽',
    image: require('../assets/toothpaste.png'),
    description: 'Профессиональная зубная паста',
  },
];

const ShopScreen = () => {
  const navigation = useNavigation();
  const { cartItems, addToCart } = useCart();

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addButtonText}>В корзину</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  row: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  productDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  productPrice: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
    width: '100%',
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ShopScreen; 
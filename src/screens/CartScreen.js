import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext'; // Для проверки авторизации

const CartScreen = () => {
  const navigation = useNavigation();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user } = useAuth(); // Проверка авторизации

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, -1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFromCart(item.id)}
          >
            <Text style={styles.removeButtonText}>Удалить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Корзина пуста</Text>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => navigation.navigate('Shop')} // Исправлено с 'Магазин' на 'Shop'
        >
          <Text style={styles.shopButtonText}>Перейти в магазин</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      // Если пользователь не авторизован — предложение войти или зарегистрироваться
      Alert.alert(
        'Авторизация требуется',
        'Пожалуйста, войдите или зарегистрируйтесь для оформления заказа.',
        [
          {
            text: 'Войти',
            onPress: () => navigation.navigate('Auth', { isRegistration: false }),
          },
          {
            text: 'Зарегистрироваться',
            onPress: () => navigation.navigate('Auth', { isRegistration: true }),
            style: 'default',
          },
          {
            text: 'Отмена',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    // Если авторизован — временная логика для оформления заказа (псевдокод для СБП)
    Alert.alert(
      'Оформление заказа',
      `Итоговая сумма: ${getCartTotal()} ₽. Подтвердить оплату через СБП?`,
      [
        {
          text: 'Подтвердить',
          onPress: () => {
            // Здесь должна быть интеграция с API СБП (например, через ЮKassa или CloudPayments)
            // Псевдокод:
            /*
            try {
              const paymentResponse = await axios.post('http://91.244.163.22:5000/api/payments', {
                amount: getCartTotal(),
                cartItems,
                userId: user.id,
              });
              Alert.alert('Успех', 'Оплата успешно выполнена!');
              // Очистка корзины после оплаты
              setCartItems([]); // Нужно обновить CartContext для очистки
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось выполнить оплату. Попробуйте позже.');
            }
            */
            Alert.alert('Успех', 'Оплата успешно выполнена! (Тестовый режим)');
            // Очистка корзины после успешной оплаты (временная логика)
            setCartItems([]); // Нужно обновить CartContext для очистки
          },
        },
        {
          text: 'Отмена',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Итого: {getCartTotal()} ₽</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Оформить заказ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  cartItem: {
    flexDirection: 'row',
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
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 'auto',
  },
  removeButtonText: {
    color: 'red',
    fontSize: 14,
  },
  totalContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  shopButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CartScreen;
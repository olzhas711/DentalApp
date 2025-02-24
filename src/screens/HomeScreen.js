import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/clinic-image.jpg')} // Замените на путь к вашему изображению клиники
        style={styles.clinicImage}
      />
      <TouchableOpacity
        style={styles.promotionButton}
        onPress={() => navigation.navigate('PromotionsDetail')}
      >
        <Text style={styles.promotionText}>Текущая акция: Скидка 20% на чистку зубов!</Text>
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={styles.buttonText}>О клинике</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Specialists')}
        >
          <Text style={styles.buttonText}>Специалисты</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Services')}
        >
          <Text style={styles.buttonText}>Услуги</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.buttonText}>Магазин</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Promotions')}
        >
          <Text style={styles.buttonText}>Акции</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.buttonText}>Вход/Регистрация</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  clinicImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 20 },
  promotionButton: { backgroundColor: '#E6F7FF', padding: 15, borderRadius: 8, marginBottom: 20 },
  promotionText: { fontSize: 16, color: '#007AFF', textAlign: 'center' },
  buttonsContainer: { flexDirection: 'column', gap: 10 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default HomeScreen;
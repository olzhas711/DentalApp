import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  // Перемещаем useEffect до условного рендеринга
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || ''
      });
    } else {
      // Сбрасываем данные если пользователь вышел
      setUserData({
        name: '',
        phone: '',
        email: '',
        address: ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    const success = await updateUserProfile(user.email, userData);
    if (success) {
      Alert.alert('Успешно', 'Профиль обновлен');
      setIsEditing(false);
    } else {
      Alert.alert('Ошибка', 'Не удалось обновить профиль');
    }
  };

  const handleLogout = async () => {
    setIsEditing(false); // Сбрасываем режим редактирования перед выходом
    await logout();
  };

  // Рендерим экран авторизации, если пользователь не авторизован
  if (!user) {
    return (
      <View style={styles.container}>
        <Icon name="account-circle" size={100} color="#007AFF" />
        <Text style={styles.title}>Необходима авторизация</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.buttonText}>Войти</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('Auth', { isRegistration: true })}
        >
          <Text style={styles.buttonText}>Зарегистрироваться</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Рендерим профиль пользователя
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="account-circle" size={100} color="#007AFF" />
        <Text style={styles.name}>{userData.name}</Text>
      </View>

      <View style={styles.infoContainer}>
        {isEditing ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Имя</Text>
              <TextInput
                style={styles.input}
                value={userData.name}
                onChangeText={(text) => setUserData({ ...userData, name: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Телефон</Text>
              <TextInput
                style={styles.input}
                value={userData.phone}
                onChangeText={(text) => setUserData({ ...userData, phone: text })}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={userData.email}
                onChangeText={(text) => setUserData({ ...userData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Адрес</Text>
              <TextInput
                style={styles.input}
                value={userData.address}
                onChangeText={(text) => setUserData({ ...userData, address: text })}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Icon name="phone" size={24} color="#007AFF" />
              <Text style={styles.infoText}>{userData.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="email" size={24} color="#007AFF" />
              <Text style={styles.infoText}>{userData.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="location-on" size={24} color="#007AFF" />
              <Text style={styles.infoText}>{userData.address}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {isEditing ? (
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Сохранить</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Редактировать</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Выйти</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
  },
  registerButton: {
    backgroundColor: '#28a745',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
});

export default ProfileScreen; 
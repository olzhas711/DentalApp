import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AuthScreen = ({ navigation, route }) => {
  const [isLogin, setIsLogin] = useState(route?.params?.isRegistration ? false : true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();

  const handleAuth = async () => {
    if (isLogin) {
      const success = await login({ 
        email: formData.email, 
        password: formData.password 
      });
      if (success) {
        navigation.goBack();
      } else {
        Alert.alert('Ошибка', 'Неверный email или пароль');
      }
    } else {
      // Валидация полей
      if (!formData.email || !formData.password || !formData.name || !formData.phone) {
        Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
        return;
      }
      
      // Валидация email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert('Ошибка', 'Пожалуйста, введите корректный email');
        return;
      }

      // Валидация телефона
      const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
      if (!phoneRegex.test(formData.phone)) {
        Alert.alert('Ошибка', 'Пожалуйста, введите телефон в формате +7 (999) 999-99-99');
        return;
      }

      const success = await register(formData);
      if (success) {
        Alert.alert('Успешно', 'Регистрация выполнена успешно');
        navigation.goBack();
      }
    }
  };

  const formatPhone = (text) => {
    let cleaned = text.replace(/\D/g, '');
    let match = cleaned.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    if (match) {
      let formatted = '';
      if (match[1]) formatted += '+' + match[1];
      if (match[2]) formatted += ' (' + match[2];
      if (match[3]) formatted += ') ' + match[3];
      if (match[4]) formatted += '-' + match[4];
      if (match[5]) formatted += '-' + match[5];
      return formatted;
    }
    return text;
  };

  return (
    <ImageBackground 
      source={require('../assets/background.png')} 
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>{isLogin ? 'Вход' : 'Регистрация'}</Text>
          
          {isLogin && (
            <View style={styles.testAccounts}>
              <Text style={styles.testAccountsTitle}>Тестовые аккаунты:</Text>
              <Text style={styles.testAccountText}>Клиент: client@test.com / 123456</Text>
              <Text style={styles.testAccountText}>Врач: doctor@test.com / 123456</Text>
            </View>
          )}

          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Имя и Фамилия *"
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Телефон *"
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: formatPhone(text)})}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Адрес"
                value={formData.address}
                onChangeText={(text) => setFormData({...formData, address: text})}
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { marginBottom: 0 }]}
              placeholder="Пароль *"
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon 
                name={showPassword ? "visibility" : "visibility-off"} 
                size={24} 
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {!isLogin && (
            <Text style={styles.hint}>* - обязательные поля</Text>
          )}

          <TouchableOpacity 
            style={styles.button}
            onPress={handleAuth}
          >
            <Text style={styles.buttonText}>
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => {
              setIsLogin(!isLogin);
              setFormData({
                email: '',
                password: '',
                name: '',
                phone: '',
                address: ''
              });
            }}
          >
            <Text style={styles.switchButtonText}>
              {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333',
  },
  input: {
    width: '80%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    width: '60%',
    alignSelf: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  switchButton: {
    marginTop: 24,
  },
  switchButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  testAccounts: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  testAccountsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  testAccountText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  inputContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  hint: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
    marginLeft: '10%',
  },
});

export default AuthScreen; 
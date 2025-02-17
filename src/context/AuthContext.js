import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const AuthContext = createContext();

// Тестовые аккаунты
const INITIAL_USERS = {
  'client@test.com': {
    password: '123456',
    role: 'client',
    userData: {
      name: 'Иван Петров',
      phone: '+7 (999) 123-45-67',
      email: 'client@test.com',
      address: 'ул. Ленина, д. 1',
    }
  },
  'doctor@test.com': {
    password: '123456',
    role: 'doctor',
    userData: {
      name: 'Др. Иван Иванов',
      phone: '+7 (999) 765-43-21',
      email: 'doctor@test.com',
      specialization: 'Стоматолог-терапевт',
      experience: '10 лет',
    }
  },
  'doctor2@test.com': {
    password: '123456',
    role: 'doctor',
    userData: {
      name: 'Др. Мария Петрова',
      phone: '+7 (999) 111-22-33',
      email: 'doctor2@test.com',
      specialization: 'Ортодонт',
      experience: '8 лет',
    }
  },
  'doctor3@test.com': {
    password: '123456',
    role: 'doctor',
    userData: {
      name: 'Др. Алексей Сидоров',
      phone: '+7 (999) 444-55-66',
      email: 'doctor3@test.com',
      specialization: 'Хирург-стоматолог',
      experience: '15 лет',
    }
  },
  'admin@test.com': {
    password: '123456',
    role: 'admin',
    userData: {
      name: 'Администратор',
      phone: '+7 (999) 999-99-99',
      email: 'admin@test.com',
      position: 'Главный администратор'
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(INITIAL_USERS);

  // Загрузка пользователей при старте
  React.useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const savedUsers = await AsyncStorage.getItem('users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        await AsyncStorage.setItem('users', JSON.stringify(INITIAL_USERS));
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const saveUsers = async (newUsers) => {
    try {
      await AsyncStorage.setItem('users', JSON.stringify(newUsers));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  };

  const login = async (credentials) => {
    try {
      const userRecord = users[credentials.email];
      
      if (userRecord && userRecord.password === credentials.password) {
        const userData = {
          email: credentials.email,
          role: userRecord.role,
          ...userRecord.userData
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      if (users[userData.email]) {
        Alert.alert('Ошибка', 'Пользователь с таким email уже существует');
        return false;
      }

      const newUser = {
        password: userData.password,
        role: 'client',
        userData: {
          name: userData.name,
          phone: userData.phone,
          email: userData.email,
          address: userData.address || '',
        }
      };

      const newUsers = {
        ...users,
        [userData.email]: newUser
      };

      setUsers(newUsers);
      await saveUsers(newUsers);

      const userInfo = {
        email: userData.email,
        role: 'client',
        ...newUser.userData
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const checkAuth = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    checkAuth();
  }, []);

  const updateUserProfile = async (email, updatedData) => {
    try {
      const updatedUsers = { ...users };
      updatedUsers[email] = {
        ...updatedUsers[email],
        userData: {
          ...updatedUsers[email].userData,
          ...updatedData
        }
      };

      await saveUsers(updatedUsers);
      setUsers(updatedUsers);

      // Обновляем текущего пользователя
      if (user?.email === email) {
        const updatedUser = {
          ...user,
          ...updatedData
        };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 
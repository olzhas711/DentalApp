import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверка аутентификации при запуске
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await axios.get("http://192.168.0.147:5000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      }
    } catch (error) {
      console.error("Auth check failed:", error.response?.data || error.message);
    } finally {
      setLoading(false); // Убедитесь, что loading всегда завершается
    }
  };

  // Авторизация
  const login = async ({ email, password }) => {
    try {
      const response = await axios.post("http://192.168.0.147:5000/api/login", { email, password });
      const { token, user } = response.data;
      await AsyncStorage.setItem("token", token);
      setUser(user);
      return true;
    } catch (error) {
      Alert.alert("Ошибка", error.response?.data?.message || "Неверный email или пароль");
      return false;
    }
  };

  // Регистрация
  const register = async ({ email, password, name, phone, address }) => {
    try {
      const response = await axios.post("http://192.168.0.147:5000/api/register", {
        email, password, name, phone, address,
      });
      const { token, user } = response.data; // Убедитесь, что сервер возвращает токен и user
      await AsyncStorage.setItem("token", token);
      setUser(user); // Автоматически авторизуем после регистрации
      return true;
    } catch (error) {
      Alert.alert("Ошибка", error.response?.data?.message || "Ошибка регистрации");
      return false;
    }
  };

  // Выход
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
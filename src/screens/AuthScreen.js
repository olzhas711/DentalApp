import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useAuth } from "../context/AuthContext";

const AuthScreen = ({ navigation, route }) => {
  const [isLogin, setIsLogin] = useState(route?.params?.isRegistration ? false : true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
  });

  const { login, register } = useAuth();

  const handleAuth = async () => {
    if (isLogin) {
      const success = await login({ email: formData.email, password: formData.password });
      if (success) {
        navigation.goBack();
      }
    } else {
      if (!formData.email || !formData.password || !formData.name || !formData.phone) {
        Alert.alert("Ошибка", "Заполните все обязательные поля");
        return;
      }

      const success = await register(formData);
      if (success) {
        Alert.alert("Успешно", "Регистрация завершена");
        setIsLogin(true);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isLogin ? "Вход" : "Регистрация"}</Text>
      
      {!isLogin && (
        <>
          <TextInput style={styles.input} placeholder="Имя" value={formData.name} onChangeText={(text) => setFormData({ ...formData, name: text })} />
          <TextInput style={styles.input} placeholder="Телефон" value={formData.phone} onChangeText={(text) => setFormData({ ...formData, phone: text })} />
          <TextInput style={styles.input} placeholder="Адрес" value={formData.address} onChangeText={(text) => setFormData({ ...formData, address: text })} />
        </>
      )}

      <TextInput style={styles.input} placeholder="Email" value={formData.email} onChangeText={(text) => setFormData({ ...formData, email: text })} />
      <TextInput style={styles.input} placeholder="Пароль" secureTextEntry value={formData.password} onChangeText={(text) => setFormData({ ...formData, password: text })} />

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isLogin ? "Войти" : "Зарегистрироваться"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchButtonText}>{isLogin ? "Нет аккаунта? Регистрация" : "Уже есть аккаунт? Вход"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, alignSelf: "center", width: "60%", marginTop: 10 },
  buttonText: { color: "white", fontSize: 16, textAlign: "center", fontWeight: "bold" },
  switchButton: { marginTop: 20, alignSelf: "center" },
  switchButtonText: { color: "#007AFF", fontSize: 16 },
});

export default AuthScreen;

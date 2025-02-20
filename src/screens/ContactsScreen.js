import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';

const ContactsScreen = () => {
  const openMap = () => {
    const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `40.712776,-74.005974`; // Пример координат
    const label = 'Dental Clinic';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Контакты</Text>
      <Text style={styles.address}>Адрес: ул. Примерная, 123, г. Примерск</Text>
      <Text style={styles.phone} onPress={() => Linking.openURL('tel:+123456789')}>Телефон: +1 (234) 567-89</Text>
      <Text style={styles.email} onPress={() => Linking.openURL('mailto:info@dentalclinic.com')}>Email: info@dentalclinic.com</Text>
      <Text style={styles.map} onPress={openMap}>Открыть карту</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  address: {
    fontSize: 16,
    marginBottom: 8,
  },
  phone: {
    fontSize: 16,
    marginBottom: 8,
    color: '#007AFF',
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
    color: '#007AFF',
  },
  map: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default ContactsScreen;

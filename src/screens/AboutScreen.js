import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

const doctors = [
  {
    id: 'doctor@test.com',
    name: 'Др. Иван Иванов',
    specialization: 'Стоматолог-терапевт',
    experience: '10 лет опыта',
    image: require('../assets/doctor1.png'),
  },
  {
    id: 'doctor2@test.com',
    name: 'Др. Мария Петрова',
    specialization: 'Ортодонт',
    experience: '8 лет опыта',
    image: require('../assets/doctor2.png'),
  },
];

const AboutScreen = ({ navigation }) => {
  const { user } = useAuth();

  const handleChatWithClinic = () => {
    if (!user) {
      navigation.navigate('Auth');
      return;
    }
    
    const admin = {
      email: 'admin@test.com',
      name: 'Администратор клиники'
    };
    
    navigation.navigate('Chat', { recipient: admin });
  };

  return (
    <ImageBackground 
      source={require('../assets/background.png')} 
      style={styles.background}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>О нашей клинике</Text>
        
        <Text style={styles.description}>
          Мы предоставляем высококачественные стоматологические услуги, 
          используя современное оборудование и инновационные методики лечения.
        </Text>

        <Text style={styles.subtitle}>Наши специалисты</Text>
        {doctors.map(doctor => (
          <View key={doctor.id} style={styles.doctorCard}>
            <Image source={doctor.image} style={styles.doctorImage} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpec}>{doctor.specialization}</Text>
              <Text style={styles.doctorExp}>{doctor.experience}</Text>
            </View>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Appointment')}
          >
            <Text style={styles.buttonText}>Записаться на прием</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, styles.chatButton]}
          onPress={handleChatWithClinic}
        >
          <Icon name="chat-bubble" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Чат с клиникой</Text>
        </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    color: '#666',
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  doctorSpec: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  doctorExp: {
    fontSize: 14,
    color: '#007AFF',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default AboutScreen; 
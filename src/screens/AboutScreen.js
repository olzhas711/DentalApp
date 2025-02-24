import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AboutScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
    >
      <ScrollView style={styles.container}>
        <View style={styles.promoBlock}>
          <Text style={styles.promoTitle}>Специальное предложение!</Text>
          <Text style={styles.promoDescription}>Скидка 20% на все услуги до конца месяца.</Text>
          <TouchableOpacity style={styles.promoButton}>
            <Text style={styles.promoButtonText}>Узнать больше</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Specialists')}
          >
            <Text style={styles.buttonText}>Доктора</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Appointment')}
          >
            <Text style={styles.buttonText}>Записаться</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Contacts')}
          >
            <Text style={styles.buttonText}>Контакты</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Branches')}
          >
            <Text style={styles.buttonText}>Филиалы</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>
          Наша стоматологическая клиника - это сочетание многолетнего опыта, передовых технологий и заботы о пациентах.
          Мы работаем более 15 лет и гордимся доверием тысяч клиентов. В нашей клинике используются только современные методы диагностики и лечения.
        </Text>

        <Text style={styles.subtitle}>Наша история</Text>
        <Text style={styles.description}>
          Клиника была основана в 2008 году группой энтузиастов, стремящихся изменить подход к стоматологии.
          С тех пор мы прошли долгий путь и стали одной из ведущих клиник в регионе. Мы внедряем инновационные методики,
          используем новейшие технологии и обеспечиваем индивидуальный подход к каждому пациенту.
        </Text>

        <Text style={styles.subtitle}>Наши достижения</Text>
        <Text style={styles.description}>
          - Лучшая стоматологическая клиника 2023 года по версии «Здоровье нации»
          - Более 20 000 довольных пациентов
          - 98% успешных имплантаций
          - Сертификаты качества и инноваций от ведущих международных организаций
        </Text>
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
  promoBlock: {
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: 16,
    color: '#444',
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  promoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#007AFF',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#444',
    textAlign: 'justify',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AboutScreen;
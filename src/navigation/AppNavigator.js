import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; // Используем createStackNavigator, а не createModalNavigator
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

import AboutScreen from '../screens/AboutScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ShopScreen from '../screens/ShopScreen';
import AppointmentScreen from '../screens/AppointmentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PromotionsScreen from '../screens/PromotionsScreen';
import AuthScreen from '../screens/AuthScreen';
import CartScreen from '../screens/CartScreen';
import DoctorScheduleScreen from '../screens/DoctorScheduleScreen';
import PatientAppointmentsScreen from '../screens/PatientAppointmentsScreen';
import ChatScreen from '../screens/ChatScreen';
import SpecialistsScreen from '../screens/SpecialistsScreen';
import ContactsScreen from '../screens/ContactsScreen';
import BranchesScreen from '../screens/BranchesScreen';
import HomeScreen from '../screens/HomeScreen';
import PromotionsDetailScreen from '../screens/PromotionsDetailScreen';

// Компонент корзины в верхнем правом углу
const CartIcon = () => {
  const navigation = useNavigation();
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <TouchableOpacity
      style={{ padding: 8, marginRight: 8 }}
      onPress={() => navigation.navigate('Cart')}
    >
      <Icon name="shopping-cart" size={24} color="#007AFF" />
      {itemCount > 0 && (
        <View style={{
          position: 'absolute',
          right: 0,
          top: 0,
          backgroundColor: 'red',
          borderRadius: 10,
          width: 20,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ color: 'white', fontSize: 12 }}>{itemCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Компонент иконки для табов
const TabIcon = ({ focused, color, size, name, hasUnread }) => (
  <View>
    <Icon name={name} size={size} color={color} />
    {hasUnread && (
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
      </View>
    )}
  </View>
);

// Создание навигаторов
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  const { user } = useAuth();
  const chat = useChat();
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    if (user) {
      setHasUnreadMessages(chat.getUnreadCount(user.email, 'admin@test.com') > 0);
    }
  }, [user, chat]);

  const isDoctor = user?.role === 'doctor';

  const getTabBarIcon = (route, focused, color, size) => {
    let iconName;
    switch (route.name) {
      case 'О клинике': iconName = 'info'; break;
      case 'Услуги': iconName = 'medical-services'; break;
      case 'Магазин': iconName = 'shopping-cart'; break;
      case 'Профиль': iconName = 'person'; break;
      case 'Акции': iconName = 'local-offer'; break;
      case 'Расписание': iconName = 'schedule'; break;
      case 'Мои записи': iconName = 'event-note'; break;
      case 'Специалисты': iconName = 'group'; break;
      case 'Контакты': iconName = 'contacts'; break;
      default: iconName = 'circle';
    }
    return (
      <TabIcon
        focused={focused}
        color={color}
        size={size}
        name={iconName}
        hasUnread={route.name === 'О клинике' && hasUnreadMessages}
      />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => getTabBarIcon(route, focused, color, size),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerRight: () => route.name === 'Магазин' ? <CartIcon /> : null,
      })}
    >
      <Tab.Screen name="О клинике" component={AboutScreen} />
      <Tab.Screen name="Услуги" component={ServicesScreen} />
      {!isDoctor && <Tab.Screen name="Магазин" component={ShopScreen} />}
      <Tab.Screen name="Специалисты" component={SpecialistsScreen} />
      <Tab.Screen name="Контакты" component={ContactsScreen} />
      {user && <Tab.Screen name="Профиль" component={ProfileScreen} />}
      {!isDoctor && user && <Tab.Screen name="Мои записи" component={PatientAppointmentsScreen} />}
      {isDoctor && <Tab.Screen name="Расписание" component={DoctorScheduleScreen} />}
      {!isDoctor && <Tab.Screen name="Акции" component={PromotionsScreen} />}
    </Tab.Navigator>
  );
};

// Модальные окна для неавторизованных пользователей
const UnauthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Branches"
        component={BranchesScreen}
        options={{
          presentation: 'modal', // Для модального окна
          headerShown: true,
          headerTitle: 'Наши филиалы',
          headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
          headerStyle: { backgroundColor: '#F5F5F5' },
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Specialists"
        component={SpecialistsScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Специалисты',
          headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
          headerStyle: { backgroundColor: '#F5F5F5' },
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Услуги',
          headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
          headerStyle: { backgroundColor: '#F5F5F5' },
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Магазин',
          headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
          headerStyle: { backgroundColor: '#F5F5F5' },
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
          headerRight: () => <CartIcon />,
        }}
      />
      <Stack.Screen
        name="PromotionsDetail"
        component={PromotionsDetailScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Детали акций',
          headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
          headerStyle: { backgroundColor: '#F5F5F5' },
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Авторизация',
          headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
          headerStyle: { backgroundColor: '#F5F5F5' },
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

// Главный навигатор
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <View style={styles.loading}><Text>Загрузка...</Text></View>; // Простой индикатор загрузки
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        // Авторизованные пользователи
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        // Неавторизованные пользователи
        <Stack.Screen name="Unauth" component={UnauthStack} />
      )}
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: true,
          title: 'Корзина',
          headerRight: () => <CartIcon />,
          headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
          headerStyle: { backgroundColor: '#F5F5F5' },
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          headerShown: true,
          title: `Чат с ${route.params.recipient.name}`,
          headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
          headerStyle: { backgroundColor: '#F5F5F5' },
        })}
      />
      <Stack.Screen
        name="Appointment"
        component={AppointmentScreen}
        options={{
          headerShown: true,
          title: 'Запись на прием',
          headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
          headerStyle: { backgroundColor: '#F5F5F5' },
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});

export default AppNavigator;
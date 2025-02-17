import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
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
      case 'Запись': iconName = 'event'; break;
      case 'Профиль': iconName = 'person'; break;
      case 'Акции': iconName = 'local-offer'; break;
      case 'Расписание': iconName = 'schedule'; break;
      case 'Мои записи': iconName = 'event-note'; break;
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
      {!isDoctor && <Tab.Screen name="Запись" component={AppointmentScreen} />}
      {isDoctor && <Tab.Screen name="Расписание" component={DoctorScheduleScreen} />}
      <Tab.Screen name="Профиль" component={ProfileScreen} />
      {!isDoctor && <Tab.Screen name="Акции" component={PromotionsScreen} />}
      {!isDoctor && (
        <Tab.Screen 
          name="Мои записи" 
          component={PatientAppointmentsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <TabIcon
                focused={false}
                color={color}
                size={size}
                name="event-note"
                hasUnread={hasUnreadMessages}
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen 
        name="Auth" 
        component={AuthScreen}
        options={{
          headerShown: true,
          title: 'Авторизация'
        }}
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          headerShown: true,
          title: 'Корзина'
        }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={({ route }) => ({
          headerShown: true,
          title: `Чат с ${route.params.recipient.name}`
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
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
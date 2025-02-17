import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  React.useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('chat_messages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const saveMessages = async (newMessages) => {
    try {
      await AsyncStorage.setItem('chat_messages', JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const markAsRead = (userId, recipientId) => {
    const newUnreadCounts = { ...unreadCounts };
    const key = `${recipientId}_${userId}`;
    newUnreadCounts[key] = 0;
    setUnreadCounts(newUnreadCounts);
  };

  const sendMessage = async (message) => {
    const newMessage = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...message
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    
    // Увеличиваем счетчик непрочитанных
    const key = `${message.senderId}_${message.recipientId}`;
    setUnreadCounts(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));

    await saveMessages(newMessages);
  };

  const getConversation = (userId, recipientId) => {
    return messages.filter(msg => 
      (msg.senderId === userId && msg.recipientId === recipientId) ||
      (msg.senderId === recipientId && msg.recipientId === userId)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const getUnreadCount = (userId, recipientId) => {
    const key = `${recipientId}_${userId}`;
    return unreadCounts[key] || 0;
  };

  const value = {
    messages,
    sendMessage,
    getConversation,
    getUnreadCount,
    markAsRead
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext); 
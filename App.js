/**
 * نقطة الدخول الرئيسية للتطبيق - وارد 3.0
 */

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from './src/utils/constants';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import './src/i18n';

// استيراد الشاشات
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';

// إنشاء المكدس للتنقل
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * مكون التنقل السفلي
 */
const TabNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.textLight,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: t('dashboard.title'),
          tabBarLabel: t('dashboard.title'),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          title: t('transactions.title'),
          tabBarLabel: t('transactions.title'),
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * شاشة تسجيل الدخول
 */
const LoginScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { login } = useAuth();

  const handleLogin = async () => {
    // تسجيل دخول تجريبي
    await login({ username: 'admin' });
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginTitle}>{t('appName')}</Text>
      <Text style={styles.loginSubtitle}>{t('welcome')}</Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>{t('security.login')}</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * مكون الجذر للتنقل
 */
const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

/**
 * المكون الرئيسي للتطبيق
 */
export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
  },
  loginButtonText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// استيراد TouchableOpacity
import { TouchableOpacity } from 'react-native';

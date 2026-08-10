/**
 * سياق المصادقة - وارد 3.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { User } from '../models/Transaction';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const STORAGE_KEYS = {
  USER_DATA: 'warid_user_data',
  AUTH_TOKEN: 'warid_auth_token',
  PIN_HASH: 'warid_pin_hash',
  BIOMETRIC_ENABLED: 'warid_biometric_enabled',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // التحقق من وجود بيانات المستخدم عند بدء التطبيق
  useEffect(() => {
    loadUserData();
    checkBiometricStatus();
  }, []);

  /**
   * تحميل بيانات المستخدم المخزنة
   */
  const loadUserData = async () => {
    try {
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);

      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * التحقق من حالة المصادقة البيومترية
   */
  const checkBiometricStatus = async () => {
    try {
      const enabled = await SecureStore.getItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
      setBiometricEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error checking biometric status:', error);
    }
  };

  /**
   * تسجيل الدخول
   */
  const login = async (credentials) => {
    try {
      // هنا يجب الاتصال بالواجهة الخلفية للتحقق من البيانات
      // هذا مثال محاكي
      const mockUser = new User({
        id: 1,
        username: credentials.username,
        email: credentials.email || `${credentials.username}@example.com`,
        fullName: 'مستخدم تجريبي',
        role: 'user',
        department: 'الإدارة العامة',
      });

      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, 'mock_token_12345');

      setUser(mockUser);
      setIsAuthenticated(true);

      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * تسجيل الخروج
   */
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * التحقق البيومتري (بصمة أو وجه)
   */
  const authenticateWithBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        return { success: false, error: 'الجهاز لا يدعم المصادقة البيومترية' };
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        return { success: false, error: 'لم يتم تسجيل بيانات بيومترية' };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'التحقق من الهوية',
        fallbackLabel: 'استخدام رمز PIN',
        cancelLabel: 'إلغاء',
      });

      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: 'فشل التحقق البيومتري' };
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * تمكين المصادقة البيومترية
   */
  const enableBiometric = async () => {
    try {
      const result = await authenticateWithBiometrics();
      if (result.success) {
        await SecureStore.setItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
        setBiometricEnabled(true);
        return { success: true };
      }
      return result;
    } catch (error) {
      console.error('Enable biometric error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * تعطيل المصادقة البيومترية
   */
  const disableBiometric = async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
      setBiometricEnabled(false);
      return { success: true };
    } catch (error) {
      console.error('Disable biometric error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * تغيير رمز PIN
   */
  const changePin = async (oldPin, newPin) => {
    try {
      // هنا يجب إضافة منطق التحقق من PIN القديم وحفظ الجديد
      // مع تشفير مناسب
      await SecureStore.setItemAsync(STORAGE_KEYS.PIN_HASH, hashPin(newPin));
      return { success: true };
    } catch (error) {
      console.error('Change PIN error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * دالة تجزئة PIN بسيطة (يجب استخدام خوارزمية أقوى في الإنتاج)
   */
  const hashPin = (pin) => {
    // هذا مثال بسيط - يجب استخدام bcrypt أو مشابه في الإنتاج
    return `hashed_${pin}`;
  };

  /**
   * التحقق من رمز PIN
   */
  const verifyPin = async (pin) => {
    try {
      const storedHash = await SecureStore.getItemAsync(STORAGE_KEYS.PIN_HASH);
      const inputHash = hashPin(pin);
      
      if (storedHash === inputHash) {
        return { success: true };
      } else {
        return { success: false, error: 'رمز PIN غير صحيح' };
      }
    } catch (error) {
      console.error('PIN verification error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * تحديث بيانات المستخدم
   */
  const updateUser = async (newData) => {
    try {
      const updatedUser = { ...user, ...newData };
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    biometricEnabled,
    login,
    logout,
    authenticateWithBiometrics,
    enableBiometric,
    disableBiometric,
    changePin,
    verifyPin,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

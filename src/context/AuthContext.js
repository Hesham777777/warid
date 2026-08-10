import React, { createContext, useContext, useState } from 'react';

// إنشاء سياق المصادقة
const AuthContext = createContext();

// مزود المصادقة
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // تسجيل الدخول
  const login = async (email, password) => {
    setLoading(true);
    try {
      // محاكاة عملية تسجيل الدخول
      // في التطبيق الحقيقي، ستقوم بالاتصال بـ API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: '1',
        email,
        name: 'مستخدم تجريبي',
      };
      
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook مخصص للوصول إلى سياق المصادقة
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

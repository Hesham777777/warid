import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'encrypted_sensitive_data';

/**
 * خدمة لتشفير وحماية البيانات الحساسة
 * تستخدم expo-secure-store لتخزين البيانات بشكل مشفر في الجهاز
 */
export const SecureDataService = {
  // حفظ بيانات حساسة (مثل التوكن أو مفاتيح API)
  saveData: async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('فشل حفظ البيانات المشفرة:', error);
      return false;
    }
  },

  // استرجاع بيانات مشفرة
  getData: async (key) => {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('فشل استرجاع البيانات المشفرة:', error);
      return null;
    }
  },

  // حذف بيانات مشفرة
  deleteData: async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error('فشل حذف البيانات المشفرة:', error);
      return false;
    }
  },
};

export default SecureDataService;

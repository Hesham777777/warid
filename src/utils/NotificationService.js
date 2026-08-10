import * as Notifications from 'expo-notifications';

/**
 * خدمة إدارة الإشعارات المحلية
 */
export const NotificationService = {
  // طلب إذن الإشعارات
  requestPermissions: async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  // جدولة إشعار محلي
  scheduleLocalNotification: async (title, body, data = {}, delaySeconds = 0) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: delaySeconds > 0 ? { seconds: delaySeconds } : null,
      });
      return true;
    } catch (error) {
      console.error('فشل جدولة الإشعار:', error);
      return false;
    }
  },

  // إلغاء جميع الإشعارات المجدولة
  cancelAllNotifications: async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return true;
    } catch (error) {
      console.error('فشل إلغاء الإشعارات:', error);
      return false;
    }
  },

  // إعداد مستمع للإشعارات عند استلامها والتطبيق مفتوح
  setupNotificationListener: (onReceived) => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      onReceived(notification);
    });
    return subscription;
  },

  // إعداد مستمع للنقر على الإشعار
  setupNotificationResponseListener: (onResponse) => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      onResponse(response);
    });
    return subscription;
  },
};

export default NotificationService;

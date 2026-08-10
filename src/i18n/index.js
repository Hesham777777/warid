/**
 * إعدادات اللغة والترجمة - وارد 3.0
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      // العام
      appName: 'وارد 3.0',
      welcome: 'مرحباً بك',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجاح',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      add: 'إضافة',
      search: 'بحث',
      filter: 'تصفية',
      refresh: 'تحديث',
      back: 'رجوع',
      next: 'التالي',
      finish: 'إنهاء',
      
      // حالات المعاملة
      status: {
        arrived: 'وصلت',
        registering: 'قيد التسجيل',
        active: 'نشطة',
        directed: 'موجّهة',
        pending: 'منتظرة رد',
        suspended: 'معلّقة',
        late: 'متأخرة',
        completed: 'مكتملة',
        archived: 'مؤرشفة',
      },
      
      // الأولويات
      priority: {
        low: 'عادي',
        medium: 'متوسط',
        high: 'عاجل',
        urgent: 'مهم جداً وعاجل',
      },
      
      // لوحة التحكم
      dashboard: {
        title: 'لوحة التحكم',
        totalTransactions: 'إجمالي المعاملات',
        activeTransactions: 'المعاملات النشطة',
        completedToday: 'المكتملة اليوم',
        lateTransactions: 'المتأخرة',
        pendingResponses: 'المنتظرة رد',
        statistics: 'الإحصائيات',
        recentActivity: 'النشاط الأخير',
      },
      
      // المعاملات
      transactions: {
        title: 'المعاملات',
        newTransaction: 'معاملة جديدة',
        transactionNumber: 'رقم المعاملة',
        subject: 'الموضوع',
        sender: 'المرسل',
        recipient: 'المستلم',
        dateReceived: 'تاريخ الاستلام',
        deadline: 'الموعد النهائي',
        attachments: 'المرفقات',
        notes: 'ملاحظات',
        history: 'سجل المعاملة',
        directTo: 'توجيه إلى',
        followUp: 'متابعة',
        complete: 'إنجاز',
        archive: 'أرشفة',
      },
      
      // البحث والتقارير
      search: {
        title: 'بحث متقدم',
        keyword: 'كلمة مفتاحية',
        dateFrom: 'من تاريخ',
        dateTo: 'إلى تاريخ',
        statusFilter: 'حالة المعاملة',
        priorityFilter: 'الأولوية',
        departmentFilter: 'القسم',
        results: 'نتائج البحث',
        exportReport: 'تصدير التقرير',
        pdf: 'PDF',
        excel: 'Excel',
        csv: 'CSV',
      },
      
      // الإشعارات
      notifications: {
        title: 'الإشعارات',
        newMessage: 'رسالة جديدة',
        deadlineApproaching: 'موعد نهائي يقترب',
        transactionLate: 'معاملة متأخرة',
        responseRequired: 'مطلوب رد',
        markAsRead: 'وضع علامة كمقروء',
        markAllAsRead: 'وضع الكل كمقروء',
        clearAll: 'مسح الكل',
      },
      
      // الأمان
      security: {
        login: 'تسجيل الدخول',
        logout: 'تسجيل الخروج',
        pinCode: 'رمز PIN',
        enterPin: 'أدخل رمز PIN',
        biometricAuth: 'المصادقة البيومترية',
        fingerprint: 'بصمة الإصبع',
        faceId: 'التعرف على الوجه',
        changePin: 'تغيير رمز PIN',
        forgotPin: 'نسيت رمز PIN؟',
      },
      
      // سلة المحذوفات
      trash: {
        title: 'سلة المحذوفات',
        restore: 'استعادة',
        permanentDelete: 'حذف نهائي',
        daysLeft: 'أيام متبقية للاستعادة',
        emptyTrash: 'سلة المحذوفات فارغة',
      },
      
      // الإعدادات
      settings: {
        title: 'الإعدادات',
        language: 'اللغة',
        arabic: 'العربية',
        english: 'English',
        theme: 'السمة',
        light: 'فاتح',
        dark: 'داكن',
        auto: 'تلقائي',
        notifications: 'الإشعارات',
        privacy: 'الخصوصية',
        about: 'حول التطبيق',
        version: 'الإصدار',
      },
      
      // رسائل الخطأ
      errors: {
        networkError: 'خطأ في الاتصال بالشبكة',
        serverError: 'خطأ في الخادم',
        notFound: 'غير موجود',
        unauthorized: 'غير مصرح',
        validationError: 'خطأ في التحقق من البيانات',
        tryAgain: 'حاول مرة أخرى',
      },
      
      // رسائل النجاح
      messages: {
        savedSuccessfully: 'تم الحفظ بنجاح',
        deletedSuccessfully: 'تم الحذف بنجاح',
        restoredSuccessfully: 'تمت الاستعادة بنجاح',
        sentSuccessfully: 'تم الإرسال بنجاح',
        updatedSuccessfully: 'تم التحديث بنجاح',
      },
    },
  },
  en: {
    translation: {
      // General
      appName: 'Warid 3.0',
      welcome: 'Welcome',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      refresh: 'Refresh',
      back: 'Back',
      next: 'Next',
      finish: 'Finish',
      
      // Transaction Status
      status: {
        arrived: 'Arrived',
        registering: 'Registering',
        active: 'Active',
        directed: 'Directed',
        pending: 'Pending Response',
        suspended: 'Suspended',
        late: 'Late',
        completed: 'Completed',
        archived: 'Archived',
      },
      
      // Priorities
      priority: {
        low: 'Normal',
        medium: 'Medium',
        high: 'Urgent',
        urgent: 'Very Important & Urgent',
      },
      
      // Dashboard
      dashboard: {
        title: 'Dashboard',
        totalTransactions: 'Total Transactions',
        activeTransactions: 'Active Transactions',
        completedToday: 'Completed Today',
        lateTransactions: 'Late',
        pendingResponses: 'Pending Responses',
        statistics: 'Statistics',
        recentActivity: 'Recent Activity',
      },
      
      // Transactions
      transactions: {
        title: 'Transactions',
        newTransaction: 'New Transaction',
        transactionNumber: 'Transaction Number',
        subject: 'Subject',
        sender: 'Sender',
        recipient: 'Recipient',
        dateReceived: 'Date Received',
        deadline: 'Deadline',
        attachments: 'Attachments',
        notes: 'Notes',
        history: 'Transaction History',
        directTo: 'Direct To',
        followUp: 'Follow Up',
        complete: 'Complete',
        archive: 'Archive',
      },
      
      // Search & Reports
      search: {
        title: 'Advanced Search',
        keyword: 'Keyword',
        dateFrom: 'From Date',
        dateTo: 'To Date',
        statusFilter: 'Status',
        priorityFilter: 'Priority',
        departmentFilter: 'Department',
        results: 'Search Results',
        exportReport: 'Export Report',
        pdf: 'PDF',
        excel: 'Excel',
        csv: 'CSV',
      },
      
      // Notifications
      notifications: {
        title: 'Notifications',
        newMessage: 'New Message',
        deadlineApproaching: 'Deadline Approaching',
        transactionLate: 'Transaction Late',
        responseRequired: 'Response Required',
        markAsRead: 'Mark as Read',
        markAllAsRead: 'Mark All as Read',
        clearAll: 'Clear All',
      },
      
      // Security
      security: {
        login: 'Login',
        logout: 'Logout',
        pinCode: 'PIN Code',
        enterPin: 'Enter PIN',
        biometricAuth: 'Biometric Authentication',
        fingerprint: 'Fingerprint',
        faceId: 'Face ID',
        changePin: 'Change PIN',
        forgotPin: 'Forgot PIN?',
      },
      
      // Trash
      trash: {
        title: 'Trash',
        restore: 'Restore',
        permanentDelete: 'Permanent Delete',
        daysLeft: 'Days Left to Restore',
        emptyTrash: 'Trash is Empty',
      },
      
      // Settings
      settings: {
        title: 'Settings',
        language: 'Language',
        arabic: 'العربية',
        english: 'English',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto',
        notifications: 'Notifications',
        privacy: 'Privacy',
        about: 'About',
        version: 'Version',
      },
      
      // Error Messages
      errors: {
        networkError: 'Network Error',
        serverError: 'Server Error',
        notFound: 'Not Found',
        unauthorized: 'Unauthorized',
        validationError: 'Validation Error',
        tryAgain: 'Try Again',
      },
      
      // Success Messages
      messages: {
        savedSuccessfully: 'Saved Successfully',
        deletedSuccessfully: 'Deleted Successfully',
        restoredSuccessfully: 'Restored Successfully',
        sentSuccessfully: 'Sent Successfully',
        updatedSuccessfully: 'Updated Successfully',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // اللغة الافتراضية
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });

export default i18n;

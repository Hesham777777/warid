import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      // الترحيب
      welcome: 'مرحباً',
      goodMorning: 'صباح الخير',
      goodEvening: 'مساء الخير',
      
      // الحالات
      status: {
        received: 'وصلت',
        inRegistration: 'قيد التسجيل',
        active: 'نشطة',
        forwarded: 'موجّهة',
        awaitingResponse: 'منتظرة رد',
        suspended: 'معلّقة',
        overdue: 'متأخرة',
        completed: 'مكتملة',
        archived: 'مؤرشفة',
      },
      
      // الأولويات
      priority: {
        normal: 'عادي',
        important: 'مهم',
        urgent: 'عاجل',
        critical: 'حرج',
      },
      
      // لوحة التحكم
      dashboard: {
        title: 'لوحة التحكم',
        activeTransactions: 'نشطة',
        overdueTransactions: 'متأخرة',
        endingToday: 'تنتهي اليوم',
        completionRate: 'معدل الإنجاز',
        needsAttention: 'تحتاج اهتماماً الآن',
        newInbox: 'الوارد الجديد',
        morningSummary: 'ملخص يومك',
        transactionsEndingToday: 'معاملات تنتهي اليوم',
        transactionsOverdue: 'معاملات متأخرة',
        transactionsAwaitingResponse: 'معاملات تنتظر الرد',
        activeTransactions: 'معاملات نشطة',
      },
      
      // المعاملات
      transaction: {
        new: 'معاملة جديدة',
        all: 'جميع المعاملات',
        details: 'تفاصيل المعاملة',
        number: 'رقم المعاملة',
        subject: 'الموضوع',
        sender: 'الجهة المرسلة',
        type: 'النوع',
        priority: 'الأولوية',
        deadline: 'المهلة',
        status: 'الحالة',
        attachments: 'المرفقات',
        comments: 'التعليقات',
        timeline: 'الجدول الزمني',
        info: 'المعلومات',
        actions: 'الإجراءات',
        close: 'إغلاق',
        reopen: 'إعادة فتح',
        forward: 'توجيه',
        remind: 'تذكير',
        archive: 'أرشفة',
        delete: 'حذف',
        search: 'بحث',
        filter: 'تصفية',
        create: 'إنشاء',
        save: 'حفظ',
        cancel: 'إلغاء',
        confirm: 'تأكيد',
        edit: 'تعديل',
      },
      
      // إنشاء معاملة
      createTransaction: {
        basicInfo: 'المعلومات الأساسية',
        classification: 'تصنيف المعاملة',
        deadline: 'تحديد المهلة',
        forwarding: 'التوجيه',
        attachments: 'المرفقات',
        review: 'مراجعة',
        autoSaved: 'تم الحفظ التلقائي',
        suggestFromImage: 'إدخال من صورة',
        template: 'استخدام قالب',
      },
      
      // البحث
      search: {
        advanced: 'بحث متقدم',
        saveSearch: 'حفظ البحث',
        savedSearches: 'عمليات البحث المحفوظة',
        filters: 'الفلاتر',
        results: 'النتائج',
      },
      
      // التقارير
      reports: {
        title: 'التقارير',
        daily: 'يومي',
        weekly: 'أسبوعي',
        monthly: 'شهري',
        performance: 'الأداء',
        overdue: 'المتأخرات',
        incoming: 'الوارد',
        completion: 'الإنجاز',
        departments: 'الأقسام',
        employees: 'الموظفين',
        types: 'أنواع المعاملات',
        senders: 'الجهات المرسلة',
        export: 'تصدير',
        print: 'طباعة',
      },
      
      // الإعدادات
      settings: {
        title: 'الإعدادات',
        profile: 'الملف الشخصي',
        security: 'الأمان',
        notifications: 'الإشعارات',
        language: 'اللغة',
        theme: 'السمة',
        backup: 'النسخ الاحتياطي',
        restore: 'الاستعادة',
        about: 'حول التطبيق',
        version: 'الإصدار',
      },
      
      // الأمان
      security: {
        pin: 'رمز PIN',
        biometric: 'البصمة',
        lock: 'قفل',
        unlock: 'فتح',
        changePin: 'تغيير الرمز',
        forgotPin: 'نسيت الرمز؟',
        recoveryCodes: 'رموز الاستعادة',
        privacy: 'الخصوصية',
      },
      
      // الإشعارات
      notifications: {
        title: 'الإشعارات',
        deadlineApproaching: 'اقتراب الموعد النهائي',
        deadlineExceeded: 'تجاوز الموعد النهائي',
        newTransaction: 'وصول معاملة جديدة',
        transactionForwarded: 'تم توجيه معاملة إليك',
        awaitingResponse: 'انتظار رد',
        reminder: 'تذكير',
        backupComplete: 'اكتمل النسخ الاحتياطي',
        suspensionReactivated: 'إعادة تفعيل معاملة معلقة',
      },
      
      // رسائل عامة
      common: {
        loading: 'جاري التحميل...',
        noData: 'لا توجد بيانات',
        error: 'حدث خطأ',
        success: 'تم بنجاح',
        confirmDelete: 'هل أنت متأكد من الحذف؟',
        confirmAction: 'هل أنت متأكد من هذا الإجراء؟',
        tryAgain: 'حاول مرة أخرى',
        refresh: 'تحديث',
        close: 'إغلاق',
        back: 'رجوع',
        next: 'التالي',
        previous: 'السابق',
        yes: 'نعم',
        no: 'لا',
      },
      
      // الأدوار
      roles: {
        secretary: 'موظف سكرتارية',
        manager: 'مدير مكتب',
        executive: 'مسؤول تنفيذي',
        admin: 'مسؤول نظام',
      },
      
      // أنواع المعاملات
      types: {
        correspondence: 'مراسلات',
        requests: 'طلبات',
        reports: 'تقارير',
        financial: 'مالية',
        legal: 'قانونية',
        administrative: 'إدارية',
        hr: 'موارد بشرية',
        technical: 'تقنية',
      },
      
      // أسباب
      reasons: {
        awaiting: {
          externalResponse: 'رد خارجي',
          decision: 'قرار',
          documents: 'مستندات',
          payment: 'دفع',
          appointment: 'موعد إجراء',
          legal: 'إجراء قانوني',
          other: 'سبب آخر',
        },
        suspension: {
          waitingDocument: 'انتظار مستند',
          managerAbsent: 'غياب المسؤول',
          adminDecision: 'قرار إداري',
          legalReason: 'سبب قانوني',
        },
        closing: {
          officialResponse: 'رد رسمي',
          internalAction: 'إجراء داخلي',
          finalReferral: 'إحالة نهائية',
          filed: 'حفظ',
          cancelled: 'إلغاء',
          duplicate: 'تكرار',
          withdrawn: 'سحب',
        },
      },
      
      // الأرشفة
      archive: {
        title: 'الأرشيف',
        active: 'أرشيف نشط',
        cold: 'أرشيف بارد',
        legal: 'أرشيف قانوني',
        restore: 'استعادة',
      },
      
      // سلة المحذوفات
      trash: {
        title: 'سلة المحذوفات',
        restore: 'استعادة',
        deleteForever: 'حذف نهائي',
        daysRemaining: 'أيام متبقية للحذف',
      },
    },
  },
  en: {
    translation: {
      // Welcome
      welcome: 'Welcome',
      goodMorning: 'Good Morning',
      goodEvening: 'Good Evening',
      
      // Status
      status: {
        received: 'Received',
        inRegistration: 'In Registration',
        active: 'Active',
        forwarded: 'Forwarded',
        awaitingResponse: 'Awaiting Response',
        suspended: 'Suspended',
        overdue: 'Overdue',
        completed: 'Completed',
        archived: 'Archived',
      },
      
      // Priority
      priority: {
        normal: 'Normal',
        important: 'Important',
        urgent: 'Urgent',
        critical: 'Critical',
      },
      
      // Dashboard
      dashboard: {
        title: 'Dashboard',
        activeTransactions: 'Active',
        overdueTransactions: 'Overdue',
        endingToday: 'Ending Today',
        completionRate: 'Completion Rate',
        needsAttention: 'Needs Attention Now',
        newInbox: 'New Inbox',
        morningSummary: 'Daily Summary',
        transactionsEndingToday: 'Transactions Ending Today',
        transactionsOverdue: 'Overdue Transactions',
        transactionsAwaitingResponse: 'Transactions Awaiting Response',
        activeTransactions: 'Active Transactions',
      },
      
      // Transaction
      transaction: {
        new: 'New Transaction',
        all: 'All Transactions',
        details: 'Transaction Details',
        number: 'Transaction Number',
        subject: 'Subject',
        sender: 'Sender',
        type: 'Type',
        priority: 'Priority',
        deadline: 'Deadline',
        status: 'Status',
        attachments: 'Attachments',
        comments: 'Comments',
        timeline: 'Timeline',
        info: 'Information',
        actions: 'Actions',
        close: 'Close',
        reopen: 'Reopen',
        forward: 'Forward',
        remind: 'Remind',
        archive: 'Archive',
        delete: 'Delete',
        search: 'Search',
        filter: 'Filter',
        create: 'Create',
        save: 'Save',
        cancel: 'Cancel',
        confirm: 'Confirm',
        edit: 'Edit',
      },
      
      // Common
      common: {
        loading: 'Loading...',
        noData: 'No Data',
        error: 'An Error Occurred',
        success: 'Success',
        confirmDelete: 'Are you sure you want to delete?',
        confirmAction: 'Are you sure?',
        tryAgain: 'Try Again',
        refresh: 'Refresh',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        yes: 'Yes',
        no: 'No',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });

export default i18n;

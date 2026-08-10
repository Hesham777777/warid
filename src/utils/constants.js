/**
 * وارد 3.0 - ثوابت التطبيق
 * نظام إدارة وتتبع دورة حياة المعاملات
 */

// حالات المعاملة ودورة حياتها
export const TRANSACTION_STATUS = {
  RECEIVED: 'received', // وصلت
  IN_REGISTRATION: 'in_registration', // قيد التسجيل
  ACTIVE: 'active', // نشطة
  FORWARDED: 'forwarded', // موجّهة
  AWAITING_RESPONSE: 'awaiting_response', // منتظرة رد
  SUSPENDED: 'suspended', // معلّقة
  OVERDUE: 'overdue', // متأخرة
  COMPLETED: 'completed', // مكتملة
  ARCHIVED: 'archived', // مؤرشفة
};

// مستويات الأولوية
export const PRIORITY_LEVELS = {
  NORMAL: 'normal', // عادي
  IMPORTANT: 'important', // مهم
  URGENT: 'urgent', // عاجل
  CRITICAL: 'critical', // حرج
};

// أنواع المعاملات
export const TRANSACTION_TYPES = {
  CORRESPONDENCE: 'correspondence', // مراسلات
  REQUESTS: 'requests', // طلبات
  REPORTS: 'reports', // تقارير
  FINANCIAL: 'financial', // مالية
  LEGAL: 'legal', // قانونية
  ADMINISTRATIVE: 'administrative', // إدارية
  HR: 'hr', // موارد بشرية
  TECHNICAL: 'technical', // تقنية
};

// أدوار المستخدمين
export const USER_ROLES = {
  SECRETARY: 'secretary', // موظف سكرتارية
  MANAGER: 'manager', // مدير مكتب
  EXECUTIVE: 'executive', // مسؤول تنفيذي
  ADMIN: 'admin', // مسؤول نظام
};

// مستويات التأخر
export const OVERDUE_LEVELS = {
  WARNING: { days: 2, label: 'تحذير' },
  MODERATE: { days: 7, label: 'تأخر متوسط' },
  CRITICAL: { days: 14, label: 'تأخر حرج' },
  SEVERE: { days: 15, label: 'تأخر شديد' },
};

// مستويات الأرشفة
export const ARCHIVE_LEVELS = {
  ACTIVE: 0, // نشطة
  ACTIVE_ARCHIVE: 1, // أرشيف نشط
  COLD_ARCHIVE: 2, // أرشيف بارد
  LEGAL_ARCHIVE: 3, // أرشيف قانوني
};

// الألوان حسب الحالة
export const STATUS_COLORS = {
  [TRANSACTION_STATUS.RECEIVED]: '#3B82F6', // أزرق
  [TRANSACTION_STATUS.IN_REGISTRATION]: '#8B5CF6', // بنفسجي
  [TRANSACTION_STATUS.ACTIVE]: '#10B981', // أخضر
  [TRANSACTION_STATUS.FORWARDED]: '#F97316', // برتقالي
  [TRANSACTION_STATUS.AWAITING_RESPONSE]: '#FBBF24', // أصفر
  [TRANSACTION_STATUS.SUSPENDED]: '#6B7280', // رمادي
  [TRANSACTION_STATUS.OVERDUE]: '#EF4444', // أحمر
  [TRANSACTION_STATUS.COMPLETED]: '#059669', // أخضر داكن
  [TRANSACTION_STATUS.ARCHIVED]: '#78716C', // بني/رمادي
};

// الألوان حسب الأولوية
export const PRIORITY_COLORS = {
  [PRIORITY_LEVELS.NORMAL]: '#6B7280',
  [PRIORITY_LEVELS.IMPORTANT]: '#3B82F6',
  [PRIORITY_LEVELS.URGENT]: '#F97316',
  [PRIORITY_LEVELS.CRITICAL]: '#EF4444',
};

// الثوابت العامة
export const APP_CONFIG = {
  NAME: 'وارد 3.0',
  VERSION: '3.0.0',
  PIN_LENGTH: 4,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 300000, // 5 دقائق
  AUTO_LOCK_TIMEOUT: 300000, // 5 دقائق
  SOFT_DELETE_DAYS: 30,
  ARCHIVE_AFTER_DAYS: 30,
  COLD_ARCHIVE_AFTER_MONTHS: 12,
};

// خيارات المهلة السريعة
export const DEADLINE_OPTIONS = [
  { label: 'اليوم', days: 0 },
  { label: 'غداً', days: 1 },
  { label: 'أسبوع', days: 7 },
  { label: 'أسبوعان', days: 14 },
  { label: 'شهر', days: 30 },
];

// أنواع المرفقات المدعومة
export const SUPPORTED_ATTACHMENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// أسباب الانتظار
export const AWAITING_REASONS = [
  'رد خارجي',
  'قرار',
  'مستندات',
  'دفع',
  'موعد إجراء',
  'إجراء قانوني',
  'سبب آخر',
];

// أسباب التعليق
export const SUSPENSION_REASONS = [
  'انتظار مستند',
  'غياب المسؤول',
  'قرار إداري',
  'سبب قانوني',
];

// أسباب الإغلاق
export const CLOSING_REASONS = [
  'رد رسمي',
  'إجراء داخلي',
  'إحالة نهائية',
  'حفظ',
  'إلغاء',
  'تكرار',
  'سحب',
];

/**
 * ثوابت التطبيق - وارد 3.0
 */

export const COLORS = {
  // الألوان الأساسية
  primary: '#1a5f7a',
  primaryDark: '#134b61',
  primaryLight: '#2d8ab8',
  
  // ألوان الحالات
  statusArrived: '#3498db',      // وصلت - أزرق
  statusRegistering: '#f39c12',  // قيد التسجيل - برتقالي
  statusActive: '#2ecc71',       // نشطة - أخضر
  statusDirected: '#9b59b6',     // موجّهة - بنفسجي
  statusPending: '#e67e22',      // منتظرة رد - برتقالي غامق
  statusSuspended: '#95a5a6',    // معلّقة - رمادي
  statusLate: '#e74c3c',         // متأخرة - أحمر
  statusCompleted: '#27ae60',    // مكتملة - أخضر غامق
  statusArchived: '#7f8c8d',     // مؤرشفة - رمادي غامق
  
  // ألوان الواجهة
  background: '#f5f6fa',
  surface: '#ffffff',
  error: '#e74c3c',
  success: '#27ae60',
  warning: '#f39c12',
  info: '#3498db',
  
  // النصوص
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  textLight: '#ffffff',
  
  // الحدود
  border: '#ecf0f1',
  borderDark: '#bdc3c7',
};

export const SIZES = {
  // الأحجام
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // خطوط
  fontSizeXS: 10,
  fontSizeSM: 12,
  fontSizeMD: 14,
  fontSizeLG: 16,
  fontSizeXL: 18,
  fontSizeXXL: 24,
  fontSizeXXXL: 32,
  
  // زوايا
  radiusSM: 4,
  radiusMD: 8,
  radiusLG: 12,
  radiusXL: 16,
  radiusRound: 9999,
  
  // ظلال
  shadowSM: 2,
  shadowMD: 4,
  shadowLG: 8,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TRANSACTION_STATUS = {
  ARRIVED: 'arrived',           // وصلت
  REGISTERING: 'registering',   // قيد التسجيل
  ACTIVE: 'active',             // نشطة
  DIRECTED: 'directed',         // موجّهة
  PENDING: 'pending',           // منتظرة رد
  SUSPENDED: 'suspended',       // معلّقة
  LATE: 'late',                 // متأخرة
  COMPLETED: 'completed',       // مكتملة
  ARCHIVED: 'archived',         // مؤرشفة
};

export const PRIORITY_LEVELS = {
  LOW: 'low',       // عادي
  MEDIUM: 'medium', // متوسط
  HIGH: 'high',     // عاجل
  URGENT: 'urgent', // مهم جداً وعاجل
};

export const DELETION_PERIOD_DAYS = 30; // فترة استعادة المحذوفات

export const API_CONFIG = {
  baseURL: 'https://api.warid.gov.sa', // مثال - يجب تعديله
  timeout: 30000,
  retries: 3,
};

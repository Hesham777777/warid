/**
 * وارد 3.0 - دوال مساعدة
 * نظام إدارة وتتبع دورة حياة المعاملات
 */

import { TRANSACTION_STATUS, PRIORITY_LEVELS, STATUS_COLORS, PRIORITY_COLORS } from './constants';

/**
 * تنسيق التاريخ
 */
export const formatDate = (date, locale = 'ar-SA') => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/**
 * تنسيق الوقت النسبي (منذ ...)
 */
export const formatRelativeTime = (date, locale = 'ar-SA') => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'الآن';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `منذ ${minutes} دقيقة`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `منذ ${hours} ساعة`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `منذ ${days} أيام`;
  }
  
  return formatDate(date, locale);
};

/**
 * حساب الفرق بالأيام
 */
export const daysDifference = (date1, date2 = new Date()) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2 - d1;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * التحقق من التأخر
 */
export const checkOverdue = (deadline, status) => {
  if (status === TRANSACTION_STATUS.COMPLETED || 
      status === TRANSACTION_STATUS.ARCHIVED) {
    return false;
  }
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  return now > deadlineDate;
};

/**
 * الحصول على مستوى التأخر
 */
export const getOverdueLevel = (deadline) => {
  const days = daysDifference(deadline);
  
  if (days <= 2) return 'WARNING';
  if (days <= 7) return 'MODERATE';
  if (days <= 14) return 'CRITICAL';
  return 'SEVERE';
};

/**
 * تنسيق رقم المعاملة
 */
export const formatTransactionNumber = (id, date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const paddedId = String(id).padStart(4, '0');
  return `TXN-${year}-${month}-${paddedId}`;
};

/**
 * الحصول على لون الحالة
 */
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || '#6B7280';
};

/**
 * الحصول على لون الأولوية
 */
export const getPriorityColor = (priority) => {
  return PRIORITY_COLORS[priority] || '#6B7280';
};

/**
 * ترجمة حالة المعاملة
 */
export const translateStatus = (status, t) => {
  const translations = {
    [TRANSACTION_STATUS.RECEIVED]: t('status.received'),
    [TRANSACTION_STATUS.IN_REGISTRATION]: t('status.inRegistration'),
    [TRANSACTION_STATUS.ACTIVE]: t('status.active'),
    [TRANSACTION_STATUS.FORWARDED]: t('status.forwarded'),
    [TRANSACTION_STATUS.AWAITING_RESPONSE]: t('status.awaitingResponse'),
    [TRANSACTION_STATUS.SUSPENDED]: t('status.suspended'),
    [TRANSACTION_STATUS.OVERDUE]: t('status.overdue'),
    [TRANSACTION_STATUS.COMPLETED]: t('status.completed'),
    [TRANSACTION_STATUS.ARCHIVED]: t('status.archived'),
  };
  return translations[status] || status;
};

/**
 * ترجمة الأولوية
 */
export const translatePriority = (priority, t) => {
  const translations = {
    [PRIORITY_LEVELS.NORMAL]: t('priority.normal'),
    [PRIORITY_LEVELS.IMPORTANT]: t('priority.important'),
    [PRIORITY_LEVELS.URGENT]: t('priority.urgent'),
    [PRIORITY_LEVELS.CRITICAL]: t('priority.critical'),
  };
  return translations[priority] || priority;
};

/**
 * حساب مدة المعالجة الصافية
 */
export const calculateProcessingDuration = (startDate, endDate, suspensionPeriods = []) => {
  const totalDays = daysDifference(startDate, endDate);
  const suspendedDays = suspensionPeriods.reduce((acc, period) => {
    return acc + daysDifference(period.start, period.end);
  }, 0);
  
  return Math.max(0, totalDays - suspendedDays);
};

/**
 * التحقق من صحة PIN
 */
export const validatePIN = (pin) => {
  return /^\d{4}$/.test(pin);
};

/**
 * تشفير بسيط للنصوص (للاستخدام المحلي فقط)
 */
export const simpleEncrypt = (text) => {
  return btoa(unescape(encodeURIComponent(text)));
};

/**
 * فك التشفير البسيط
 */
export const simpleDecrypt = (encryptedText) => {
  try {
    return decodeURIComponent(escape(atob(encryptedText)));
  } catch (e) {
    return encryptedText;
  }
};

/**
 * اقتطاع النص مع إضافة ...
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * تنسيق حجم الملف
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * الحصول على أيقونة نوع الملف
 */
export const getFileIcon = (mimeType) => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('excel')) return '📊';
  return '📎';
};

/**
 * توليد معرف فريد
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

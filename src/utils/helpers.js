/**
 * دوال مساعدة - وارد 3.0
 */

import { format, parseISO, differenceInDays, isPast, isToday } from 'date-fns';
import { arSA } from 'date-fns/locale';

/**
 * تنسيق التاريخ
 * @param {string|Date} date - التاريخ
 * @param {string} formatStr - نمط التنسيق
 * @returns {string} التاريخ المنسق
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: arSA });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

/**
 * تنسيق الوقت
 * @param {string|Date} date - التاريخ
 * @returns {string} الوقت المنسق
 */
export const formatTime = (date) => {
  return formatDate(date, 'HH:mm');
};

/**
 * تنسيق التاريخ والوقت معاً
 * @param {string|Date} date - التاريخ
 * @returns {string} التاريخ والوقت المنسقين
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * حساب الفرق بالأيام
 * @param {string|Date} fromDate - تاريخ البداية
 * @param {string|Date} toDate - تاريخ النهاية
 * @returns {number} عدد الأيام
 */
export const daysDifference = (fromDate, toDate = new Date()) => {
  try {
    const from = typeof fromDate === 'string' ? parseISO(fromDate) : fromDate;
    const to = typeof toDate === 'string' ? parseISO(toDate) : toDate;
    return differenceInDays(to, from);
  } catch (error) {
    console.error('Error calculating days difference:', error);
    return 0;
  }
};

/**
 * التحقق مما إذا كان التاريخ قد انتهى
 * @param {string|Date} date - التاريخ
 * @returns {boolean} true إذا كان التاريخ في الماضي
 */
export const isDatePast = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isPast(dateObj);
  } catch (error) {
    return false;
  }
};

/**
 * التحقق مما إذا كان التاريخ هو اليوم
 * @param {string|Date} date - التاريخ
 * @returns {boolean} true إذا كان التاريخ هو اليوم
 */
export const isDateToday = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isToday(dateObj);
  } catch (error) {
    return false;
  }
};

/**
 * تنسيق النص للعرض
 * @param {string} text - النص
 * @param {number} maxLength - الطول الأقصى
 * @returns {string} النص المنسق
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * تنسيق الرقم لإضافة فواصل الآلاف
 * @param {number} num - الرقم
 * @returns {string} الرقم المنسق
 */
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  return Number(num).toLocaleString('ar-SA');
};

/**
 * توليد رقم معاملة فريد
 * @returns {string} رقم المعاملة
 */
export const generateTransactionNumber = () => {
  const prefix = 'WRD';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}-${year}-${random}`;
};

/**
 * التحقق من صحة البريد الإلكتروني
 * @param {string} email - البريد الإلكتروني
 * @returns {boolean} true إذا كان البريد صالحاً
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * التحقق من صحة رقم الهاتف السعودي
 * @param {string} phone - رقم الهاتف
 * @returns {boolean} true إذا كان الرقم صالحاً
 */
export const isValidSaudiPhone = (phone) => {
  const regex = /^(\+966|0)?5[0-9]{8}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

/**
 * تأخير التنفيذ
 * @param {number} ms - الميلي ثانية
 * @returns {Promise}
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * الحصول على حالة التأخير
 * @param {string} deadline - الموعد النهائي
 * @returns {boolean} true إذا كانت المعاملة متأخرة
 */
export const isLate = (deadline) => {
  if (!deadline) return false;
  return isDatePast(deadline);
};

/**
 * حساب نسبة التقدم
 * @param {number} current - القيمة الحالية
 * @param {number} total - القيمة الكلية
 * @returns {number} النسبة المئوية
 */
export const calculateProgress = (current, total) => {
  if (!total || total === 0) return 0;
  return Math.round((current / total) * 100);
};

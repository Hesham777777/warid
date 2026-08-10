// دوال مساعدة للتعامل مع التواريخ
export const formatDate = (date, locale = 'ar-EG') => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (date, locale = 'ar-EG') => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// دوال مساعدة للتعامل مع النصوص
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// دوال مساعدة للأرقام
export const formatNumber = (num, locale = 'ar-EG') => {
  if (num === null || num === undefined) return '';
  return new Intl.NumberFormat(locale).format(num);
};

export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

// دوال مساعدة للتحقق من صحة البيانات
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

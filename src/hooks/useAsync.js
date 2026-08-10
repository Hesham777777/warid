/**
 * Hook مخصص للعمليات غير المتزامنة - وارد 3.0
 */

import { useState, useCallback } from 'react';

/**
 * Hook لإدارة حالة التحميل والخطأ والبيانات
 * @returns {Object} يحتوي على loading, error, data, setData, setLoading, setError, execute
 */
export const useAsync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * تنفيذ دالة غير متزامنة مع إدارة الحالة
   * @param {Function} asyncFn - الدالة غير المتزامنة المراد تنفيذها
   * @param {Object} options - خيارات إضافية
   * @returns {any} نتيجة الدالة
   */
  const execute = useCallback(async (asyncFn, options = {}) => {
    const { resetData = true, onSuccess, onError } = options;

    try {
      setLoading(true);
      setError(null);
      
      if (resetData) {
        setData(null);
      }

      const result = await asyncFn();
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      setError(err.message || 'حدث خطأ غير متوقع');
      
      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * إعادة تعيين الحالة
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    setData,
    setLoading,
    setError,
    execute,
    reset,
  };
};

/**
 * Hook مخصص لجلب البيانات مع دعم التحديث التلقائي
 * @param {Function} fetchFn - دالة الجلب
 * @param {Object} options - خيارات التهيئة
 * @returns {Object} يحتوي على البيانات والحالة ودوال التحكم
 */
export const useFetch = (fetchFn, options = {}) => {
  const { initialData = null, autoFetch = true, refreshInterval = null } = options;
  
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const [data, setData] = useState(initialData);

  /**
   * جلب البيانات
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFn();
      setData(result);
      
      return result;
    } catch (err) {
      setError(err.message || 'فشل جلب البيانات');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  // الجلب التلقائي عند التهيئة
  React.useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  // التحديث الدوري إذا تم تحديد interval
  React.useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const intervalId = setInterval(fetchData, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, fetchData]);

  return {
    loading,
    error,
    data,
    fetchData,
    setData,
    refetch: fetchData,
  };
};

/**
 * Hook مخصص للتعامل مع النماذج
 * @param {Object} initialValues - القيم الأولية
 * @returns {Object} يحتوي على قيم النموذج ودوال التعامل معه
 */
export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * تحديث قيمة حقل
   */
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // مسح الخطأ عند التغيير
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  /**
   * التحقق من صحة النموذج
   */
  const validate = useCallback((validationRules) => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      const value = values[field];

      rules.forEach(rule => {
        const error = rule(value, values);
        if (error) {
          newErrors[field] = error;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  /**
   * إرسال النموذج
   */
  const handleSubmit = useCallback(async (submitFn) => {
    setIsSubmitting(true);
    try {
      await submitFn(values);
      return true;
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values]);

  /**
   * إعادة تعيين النموذج
   */
  const reset = useCallback((newValues = null) => {
    setValues(newValues || initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    validate,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  };
};

/**
 * Hook مخصص للبحث مع التأخير (Debounce)
 * @param {string} initialValue - القيمة الأولية
 * @param {number} delay - مدة التأخير بالميلي ثانية
 * @returns {Object} يحتوي على قيمة البحث ودالة التحديث
 */
export const useDebounceSearch = (initialValue = '', delay = 500) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
  };
};

export default useAsync;

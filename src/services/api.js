/**
 * خدمة الاتصال بالواجهة الخلفية - وارد 3.0
 */

import { API_CONFIG } from '../utils/constants';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept-Language': 'ar',
    };
    this.token = null;
  }

  /**
   * تعيين رمز المصادقة
   */
  setToken(token) {
    this.token = token;
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  /**
   * طلب GET
   */
  async get(endpoint, params = {}) {
    return this.request('GET', endpoint, null, params);
  }

  /**
   * طلب POST
   */
  async post(endpoint, data) {
    return this.request('POST', endpoint, data);
  }

  /**
   * طلب PUT
   */
  async put(endpoint, data) {
    return this.request('PUT', endpoint, data);
  }

  /**
   * طلب PATCH
   */
  async patch(endpoint, data) {
    return this.request('PATCH', endpoint, data);
  }

  /**
   * طلب DELETE
   */
  async delete(endpoint) {
    return this.request('DELETE', endpoint);
  }

  /**
   * تنفيذ الطلب
   */
  async request(method, endpoint, data = null, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    // إضافة معاملات البحث
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const options = {
      method,
      headers: { ...this.headers },
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url.toString(), options);
      
      if (!response.ok) {
        throw await this.handleError(response);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * معالجة الأخطاء
   */
  async handleError(response) {
    const status = response.status;
    let message = 'حدث خطأ غير متوقع';

    try {
      const errorData = await response.json();
      message = errorData.message || errorData.error || message;
    } catch {
      // إذا لم يكن هناك JSON في الاستجابة
    }

    const error = new Error(message);
    error.status = status;
    error.response = response;

    switch (status) {
      case 400:
        error.type = 'BAD_REQUEST';
        break;
      case 401:
        error.type = 'UNAUTHORIZED';
        break;
      case 403:
        error.type = 'FORBIDDEN';
        break;
      case 404:
        error.type = 'NOT_FOUND';
        break;
      case 500:
        error.type = 'SERVER_ERROR';
        break;
      default:
        error.type = 'NETWORK_ERROR';
    }

    return error;
  }

  /**
   * تحميل ملف
   */
  async downloadFile(endpoint, filename) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: { ...this.headers },
      });

      if (!response.ok) {
        throw await this.handleError(response);
      }

      const blob = await response.blob();
      return { blob, filename };
    } catch (error) {
      console.error(`Download Error (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * رفع ملف
   */
  async uploadFile(endpoint, file, additionalData = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const formData = new FormData();
    formData.append('file', file);

    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: this.headers['Authorization'],
        },
        body: formData,
      });

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      console.error(`Upload Error (${endpoint}):`, error);
      throw error;
    }
  }
}

// إنشاء مث Singleton
const apiService = new ApiService();

export default apiService;

/**
 * دوال مساعدة للتعامل مع المعاملات
 */
export const transactionApi = {
  // جلب جميع المعاملات
  getAll: (filters = {}) => apiService.get('/transactions', filters),
  
  // جلب معاملة محددة
  getById: (id) => apiService.get(`/transactions/${id}`),
  
  // إنشاء معاملة جديدة
  create: (data) => apiService.post('/transactions', data),
  
  // تحديث معاملة
  update: (id, data) => apiService.put(`/transactions/${id}`, data),
  
  // حذف معاملة
  delete: (id) => apiService.delete(`/transactions/${id}`),
  
  // توجيه معاملة
  direct: (id, assignedTo, department) => 
    apiService.post(`/transactions/${id}/direct`, { assignedTo, department }),
  
  // إنجاز معاملة
  complete: (id) => apiService.post(`/transactions/${id}/complete`),
  
  // أرشفة معاملة
  archive: (id) => apiService.post(`/transactions/${id}/archive`),
  
  // استعادة من المحذوفات
  restore: (id) => apiService.post(`/transactions/${id}/restore`),
  
  // جلب سجل التاريخ
  getHistory: (id) => apiService.get(`/transactions/${id}/history`),
  
  // إضافة مرفق
  addAttachment: (id, file) => apiService.uploadFile(`/transactions/${id}/attachments`, file),
  
  // حذف مرفق
  removeAttachment: (transactionId, attachmentId) => 
    apiService.delete(`/transactions/${transactionId}/attachments/${attachmentId}`),
};

/**
 * دوال مساعدة للمستخدمين
 */
export const userApi = {
  // تسجيل الدخول
  login: (credentials) => apiService.post('/auth/login', credentials),
  
  // تسجيل الخروج
  logout: () => apiService.post('/auth/logout'),
  
  // جلب بيانات المستخدم الحالي
  getCurrentUser: () => apiService.get('/users/me'),
  
  // تحديث بيانات المستخدم
  updateProfile: (data) => apiService.put('/users/me', data),
  
  // تغيير رمز PIN
  changePin: (oldPin, newPin) => apiService.post('/users/change-pin', { oldPin, newPin }),
  
  // التحقق البيومتري
  verifyBiometric: () => apiService.post('/auth/verify-biometric'),
};

/**
 * دوال مساعدة للإحصائيات والتقارير
 */
export const statsApi = {
  // جلب إحصائيات لوحة التحكم
  getDashboardStats: () => apiService.get('/stats/dashboard'),
  
  // جلب تقرير مفصل
  getReport: (filters) => apiService.get('/reports', filters),
  
  // تصدير تقرير PDF
  exportPdf: (filters) => apiService.downloadFile('/reports/export/pdf', 'report.pdf'),
  
  // تصدير تقرير Excel
  exportExcel: (filters) => apiService.downloadFile('/reports/export/excel', 'report.xlsx'),
};

/**
 * دوال مساعدة للإشعارات
 */
export const notificationApi = {
  // جلب جميع الإشعارات
  getAll: (filters = {}) => apiService.get('/notifications', filters),
  
  // وضع إشعار كمقروء
  markAsRead: (id) => apiService.patch(`/notifications/${id}/read`),
  
  // وضع كل الإشعارات كمقروءة
  markAllAsRead: () => apiService.patch('/notifications/read-all'),
  
  // مسح كل الإشعارات
  clearAll: () => apiService.delete('/notifications/all'),
  
  // عدد الإشعارات غير المقروءة
  getUnreadCount: () => apiService.get('/notifications/unread-count'),
};

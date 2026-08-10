/**
 * خدمة قاعدة البيانات المحلية SQLite - وارد 3.0
 */

import * as SQLite from 'expo-sqlite';

const DB_NAME = 'warid.db';

class DatabaseService {
  constructor() {
    this.db = null;
  }

  /**
   * تهيئة قاعدة البيانات
   */
  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync(DB_NAME);
      await this.createTables();
      console.log('Database initialized successfully');
      return true;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  /**
   * إنشاء الجداول
   */
  async createTables() {
    await this.db.execAsync(`
      -- جدول المعاملات
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_number TEXT UNIQUE NOT NULL,
        subject TEXT NOT NULL,
        sender TEXT,
        sender_organization TEXT,
        recipient TEXT,
        date_received TEXT NOT NULL,
        deadline TEXT,
        status TEXT DEFAULT 'arrived',
        priority TEXT DEFAULT 'medium',
        notes TEXT,
        assigned_to INTEGER,
        department TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT
      );

      -- جدول المرفقات
      CREATE TABLE IF NOT EXISTS attachments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id INTEGER NOT NULL,
        file_name TEXT NOT NULL,
        file_type TEXT,
        file_size INTEGER,
        file_url TEXT,
        uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
        uploaded_by INTEGER,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
      );

      -- جدول سجل التاريخ
      CREATE TABLE IF NOT EXISTS transaction_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        user_id INTEGER,
        user_name TEXT,
        notes TEXT,
        previous_status TEXT,
        new_status TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
      );

      -- جدول المستخدمين
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        full_name TEXT,
        role TEXT DEFAULT 'user',
        department TEXT,
        phone TEXT,
        is_active INTEGER DEFAULT 1,
        last_login TEXT,
        pin_hash TEXT,
        biometric_enabled INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول الإشعارات
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT,
        transaction_id INTEGER,
        user_id INTEGER,
        is_read INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
      );

      -- جدول الإعدادات
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );

      -- فهارس لتحسين الأداء
      CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
      CREATE INDEX IF NOT EXISTS idx_transactions_priority ON transactions(priority);
      CREATE INDEX IF NOT EXISTS idx_transactions_deleted ON transactions(deleted_at);
      CREATE INDEX IF NOT EXISTS idx_transactions_number ON transactions(transaction_number);
      CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
    `);
  }

  /**
   * تنفيذ استعلام SQL
   */
  async executeQuery(sql, params = []) {
    try {
      const result = await this.db.getFirstAsync(sql, params);
      return result;
    } catch (error) {
      console.error('Query execution error:', error);
      throw error;
    }
  }

  /**
   * تنفيذ استعلام يرجع عدة صفوف
   */
  async executeAllQuery(sql, params = []) {
    try {
      const result = await this.db.getAllAsync(sql, params);
      return result || [];
    } catch (error) {
      console.error('Query execution error:', error);
      throw error;
    }
  }

  /**
   * تنفيذ عملية كتابة (INSERT, UPDATE, DELETE)
   */
  async executeWrite(sql, params = []) {
    try {
      const result = await this.db.runAsync(sql, params);
      return result;
    } catch (error) {
      console.error('Write operation error:', error);
      throw error;
    }
  }

  /**
   * جلب جميع المعاملات
   */
  async getAllTransactions(filters = {}) {
    let sql = `
      SELECT * FROM transactions 
      WHERE deleted_at IS NULL
    `;
    const params = [];

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.priority) {
      sql += ' AND priority = ?';
      params.push(filters.priority);
    }

    if (filters.department) {
      sql += ' AND department = ?';
      params.push(filters.department);
    }

    if (filters.search) {
      sql += ' AND (subject LIKE ? OR transaction_number LIKE ? OR sender LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY created_at DESC';

    return await this.executeAllQuery(sql, params);
  }

  /**
   * جلب معاملة محددة
   */
  async getTransactionById(id) {
    const sql = 'SELECT * FROM transactions WHERE id = ? AND deleted_at IS NULL';
    return await this.executeQuery(sql, [id]);
  }

  /**
   * إنشاء معاملة جديدة
   */
  async createTransaction(data) {
    const sql = `
      INSERT INTO transactions (
        transaction_number, subject, sender, sender_organization,
        recipient, date_received, deadline, status, priority, notes,
        assigned_to, department
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.transactionNumber,
      data.subject,
      data.sender,
      data.senderOrganization,
      data.recipient,
      data.dateReceived,
      data.deadline,
      data.status,
      data.priority,
      data.notes,
      data.assignedTo,
      data.department,
    ];

    const result = await this.executeWrite(sql, params);
    return result.lastInsertRowId;
  }

  /**
   * تحديث معاملة
   */
  async updateTransaction(id, data) {
    const fields = [];
    const params = [];

    Object.keys(data).forEach(key => {
      fields.push(`${key} = ?`);
      params.push(data[key]);
    });

    params.push(id);

    const sql = `UPDATE transactions SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    return await this.executeWrite(sql, params);
  }

  /**
   * حذف معاملة (نقل لسلة المحذوفات)
   */
  async softDeleteTransaction(id) {
    const sql = 'UPDATE transactions SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?';
    return await this.executeWrite(sql, [id]);
  }

  /**
   * استعادة معاملة من سلة المحذوفات
   */
  async restoreTransaction(id) {
    const sql = 'UPDATE transactions SET deleted_at = NULL WHERE id = ?';
    return await this.executeWrite(sql, [id]);
  }

  /**
   * الحذف النهائي من سلة المحذوفات
   */
  async permanentDeleteTransaction(id) {
    const sql = 'DELETE FROM transactions WHERE id = ?';
    return await this.executeWrite(sql, [id]);
  }

  /**
   * إضافة سجل تاريخ
   */
  async addHistoryEntry(data) {
    const sql = `
      INSERT INTO transaction_history (
        transaction_id, action, user_id, user_name, notes,
        previous_status, new_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.transactionId,
      data.action,
      data.userId,
      data.userName,
      data.notes,
      data.previousStatus,
      data.newStatus,
    ];

    return await this.executeWrite(sql, params);
  }

  /**
   * جلب سجل تاريخ المعاملة
   */
  async getTransactionHistory(transactionId) {
    const sql = `
      SELECT * FROM transaction_history 
      WHERE transaction_id = ? 
      ORDER BY timestamp DESC
    `;
    return await this.executeAllQuery(sql, [transactionId]);
  }

  /**
   * جلب إحصائيات لوحة التحكم
   */
  async getDashboardStats() {
    const stats = {};

    // إجمالي المعاملات
    const totalResult = await this.executeQuery(
      'SELECT COUNT(*) as count FROM transactions WHERE deleted_at IS NULL'
    );
    stats.total = totalResult?.count || 0;

    // المعاملات النشطة
    const activeResult = await this.executeQuery(
      "SELECT COUNT(*) as count FROM transactions WHERE status IN ('active', 'directed', 'registering') AND deleted_at IS NULL"
    );
    stats.active = activeResult?.count || 0;

    // المكتملة اليوم
    const completedTodayResult = await this.executeQuery(
      `SELECT COUNT(*) as count FROM transactions 
       WHERE status = 'completed' AND DATE(updated_at) = DATE('now') AND deleted_at IS NULL`
    );
    stats.completedToday = completedTodayResult?.count || 0;

    // المتأخرة
    const lateResult = await this.executeQuery(
      `SELECT COUNT(*) as count FROM transactions 
       WHERE deadline < DATE('now') AND status NOT IN ('completed', 'archived') AND deleted_at IS NULL`
    );
    stats.late = lateResult?.count || 0;

    // المنتظرة رد
    const pendingResult = await this.executeQuery(
      "SELECT COUNT(*) as count FROM transactions WHERE status = 'pending' AND deleted_at IS NULL"
    );
    stats.pending = pendingResult?.count || 0;

    return stats;
  }

  /**
   * تنظيف سلة المحذوفات (حذف المعاملات القديمة)
   */
  async cleanTrash(daysOlderThan = 30) {
    const sql = `
      DELETE FROM transactions 
      WHERE deleted_at IS NOT NULL 
      AND julianday('now') - julianday(deleted_at) > ?
    `;
    return await this.executeWrite(sql, [daysOlderThan]);
  }

  /**
   * إغلاق قاعدة البيانات
   */
  async close() {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

// إنشاء مث Singleton
const databaseService = new DatabaseService();

export default databaseService;

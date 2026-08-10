/**
 * وارد 3.0 - خدمة قاعدة البيانات SQLite
 */

import * as SQLite from 'expo-sqlite';
import { TRANSACTION_STATUS, PRIORITY_LEVELS, TRANSACTION_TYPES, ARCHIVE_LEVELS } from '../utils/constants';

const DB_NAME = 'warid.db';
let dbInstance = null;

export const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbInstance;
};

export const initializeDatabase = async () => {
  const db = await getDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_number TEXT UNIQUE,
        subject TEXT NOT NULL,
        sender TEXT,
        sender_type TEXT DEFAULT 'external',
        type TEXT DEFAULT '${TRANSACTION_TYPES.CORRESPONDENCE}',
        priority TEXT DEFAULT '${PRIORITY_LEVELS.NORMAL}',
        tags TEXT,
        deadline TEXT,
        status TEXT DEFAULT '${TRANSACTION_STATUS.RECEIVED}',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        is_confidential INTEGER DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id INTEGER,
        action TEXT,
        old_value TEXT,
        new_value TEXT,
        user_id INTEGER,
        user_name TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_status ON transactions(status);
      CREATE INDEX IF NOT EXISTS idx_deadline ON transactions(deadline);
      CREATE INDEX IF NOT EXISTS idx_created_at ON transactions(created_at);
      CREATE INDEX IF NOT EXISTS idx_sender ON transactions(sender);
    `);
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('DB init error:', error);
    throw error;
  }
};

export const TransactionService = {
  create: async (tx, data) => {
    try {
      const result = await tx.runAsync(
        `INSERT INTO transactions (transaction_number, subject, sender, type, priority, deadline, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.transactionNumber, data.subject, data.sender, data.type, data.priority, data.deadline, data.createdBy]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },
  getAll: async (tx, filters = {}) => {
    try {
      let query = 'SELECT * FROM transactions WHERE deleted_at IS NULL';
      const params = [];
      if (filters.status) { 
        query += ' AND status = ?'; 
        params.push(filters.status); 
      }
      if (filters.search) { 
        query += ' AND subject LIKE ?'; 
        params.push(`%${filters.search}%`); 
      }
      query += ' ORDER BY created_at DESC';
      if (filters.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
      }
      return await tx.getAllAsync(query, params);
    } catch (error) {
      console.error('Error getting all transactions:', error);
      throw error;
    }
  },
  getById: async (tx, id) => {
    try {
      return await tx.getFirstAsync('SELECT * FROM transactions WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error getting transaction by ID:', error);
      throw error;
    }
  },
  update: async (tx, id, updates) => {
    try {
      const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
      const values = [...Object.values(updates), id];
      await tx.runAsync(`UPDATE transactions SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },
  getDashboardStats: async (tx) => {
    try {
      const active = await tx.getFirstAsync("SELECT COUNT(*) as count FROM transactions WHERE status = ? AND deleted_at IS NULL", ['active']);
      const completed = await tx.getFirstAsync("SELECT COUNT(*) as count FROM transactions WHERE status = ? AND deleted_at IS NULL", ['completed']);
      const overdue = await tx.getFirstAsync("SELECT COUNT(*) as count FROM transactions WHERE deadline < ? AND status NOT IN (?, ?)", [new Date().toISOString(), 'completed', 'archived']);
      const total = await tx.getFirstAsync("SELECT COUNT(*) as count FROM transactions WHERE deleted_at IS NULL");
      
      const completionRate = total.count > 0 ? Math.round((completed.count / total.count) * 100) : 0;
      
      return { 
        active: active?.count || 0, 
        completed: completed?.count || 0, 
        overdue: overdue?.count || 0,
        completionRate
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return { active: 0, completed: 0, overdue: 0, completionRate: 0 };
    }
  }
};

export default { initializeDatabase, getDatabase, TransactionService };

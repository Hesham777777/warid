/**
 * وارد 3.0 - خدمة قاعدة البيانات SQLite
 */

import * as SQLite from 'expo-sqlite';
import { TRANSACTION_STATUS, PRIORITY_LEVELS, TRANSACTION_TYPES, ARCHIVE_LEVELS } from '../utils/constants';

const DB_NAME = 'warid.db';

export const getDatabase = async () => await SQLite.openDatabaseAsync(DB_NAME);

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
    `);
    console.log('Database initialized');
    return true;
  } catch (error) {
    console.error('DB init error:', error);
    throw error;
  }
};

export const TransactionService = {
  create: async (tx, data) => {
    const result = await tx.runAsync(
      `INSERT INTO transactions (transaction_number, subject, sender, type, priority, deadline, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.transactionNumber, data.subject, data.sender, data.type, data.priority, data.deadline, data.createdBy]
    );
    return result.lastInsertRowId;
  },
  getAll: async (tx, filters = {}) => {
    let query = 'SELECT * FROM transactions WHERE deleted_at IS NULL';
    const params = [];
    if (filters.status) { query += ' AND status = ?'; params.push(filters.status); }
    if (filters.search) { query += ' AND subject LIKE ?'; params.push(`%${filters.search}%`); }
    query += ' ORDER BY created_at DESC';
    return await tx.getAllAsync(query, params);
  },
  getById: async (tx, id) => await tx.getFirstAsync('SELECT * FROM transactions WHERE id = ?', [id]),
  update: async (tx, id, updates) => {
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    await tx.runAsync(`UPDATE transactions SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
  },
  getDashboardStats: async (tx) => {
    const active = await tx.getFirstAsync("SELECT COUNT(*) as count FROM transactions WHERE status = ? AND deleted_at IS NULL", ['active']);
    const completed = await tx.getFirstAsync("SELECT COUNT(*) as count FROM transactions WHERE status = ? AND deleted_at IS NULL", ['completed']);
    const overdue = await tx.getFirstAsync("SELECT COUNT(*) as count FROM transactions WHERE deadline < ? AND status NOT IN (?, ?)", [new Date().toISOString(), 'completed', 'archived']);
    return { active: active.count, completed: completed.count, overdue: overdue.count };
  }
};

export default { initializeDatabase, getDatabase, TransactionService };

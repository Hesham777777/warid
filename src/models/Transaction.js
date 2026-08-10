/**
 * وارد 3.0 - نموذج المعاملة
 */

import { TRANSACTION_STATUS, PRIORITY_LEVELS, TRANSACTION_TYPES } from '../utils/constants';

export class Transaction {
  constructor(data) {
    this.id = data.id || null;
    this.transactionNumber = data.transactionNumber || null;
    this.subject = data.subject || '';
    this.sender = data.sender || '';
    this.senderType = data.senderType || 'external'; // internal, external, government
    this.externalReferenceNumber = data.externalReferenceNumber || '';
    this.documentDate = data.documentDate || new Date();
    this.contactInfo = data.contactInfo || {};
    
    // التصنيف
    this.type = data.type || TRANSACTION_TYPES.CORRESPONDENCE;
    this.category = data.category || '';
    this.priority = data.priority || PRIORITY_LEVELS.NORMAL;
    this.tags = data.tags || [];
    
    // المهلة
    this.deadline = data.deadline || null;
    this.deadlineTime = data.deadlineTime || null;
    
    // الحالة
    this.status = data.status || TRANSACTION_STATUS.RECEIVED;
    this.createdAt = data.createdAt || new Date();
    this.createdBy = data.createdBy || null;
    this.updatedAt = data.updatedAt || new Date();
    this.updatedBy = data.updatedBy || null;
    
    // التوجيه
    this.forwardedTo = data.forwardedTo || null;
    this.forwardedToDepartment = data.forwardedToDepartment || null;
    this.forwardingNote = data.forwardingNote || '';
    this.expectedResponseDate = data.expectedResponseDate || null;
    this.forwardingHistory = data.forwardingHistory || [];
    
    // الانتظار/التعليق
    this.awaitingReason = data.awaitingReason || null;
    this.awaitingSince = data.awaitingSince || null;
    this.suspensionReason = data.suspensionReason || null;
    this.suspensionSince = data.suspensionSince || null;
    this.reactivationDate = data.reactivationDate || null;
    
    // الإغلاق
    this.closedAt = data.closedAt || null;
    this.closedBy = data.closedBy || null;
    this.closingReason = data.closingReason || null;
    this.finalResponse = data.finalResponse || '';
    this.processingDuration = data.processingDuration || null;
    
    // الأرشفة
    this.archiveLevel = data.archiveLevel || 0;
    this.archivedAt = data.archivedAt || null;
    
    // الحذف
    this.deletedAt = data.deletedAt || null;
    this.deletedBy = data.deletedBy || null;
    this.permanentDeleteDate = data.permanentDeleteDate || null;
    
    // أخرى
    this.isConfidential = data.isConfidential || false;
    this.isPinned = data.isPinned || false;
    this.completionPercentage = data.completionPercentage || 0;
    this.notes = data.notes || '';
  }
  
  /**
   * التحقق مما إذا كانت المعاملة متأخرة
   */
  isOverdue() {
    if (!this.deadline) return false;
    if ([TRANSACTION_STATUS.COMPLETED, TRANSACTION_STATUS.ARCHIVED].includes(this.status)) {
      return false;
    }
    return new Date() > new Date(this.deadline);
  }
  
  /**
   * حساب أيام التأخر
   */
  getOverdueDays() {
    if (!this.isOverdue()) return 0;
    const now = new Date();
    const deadline = new Date(this.deadline);
    return Math.ceil((now - deadline) / (1000 * 60 * 60 * 24));
  }
  
  /**
   * التحقق مما إذا كانت تنتهي اليوم
   */
  endsToday() {
    if (!this.deadline) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(this.deadline);
    deadline.setHours(0, 0, 0, 0);
    return today.getTime() === deadline.getTime();
  }
  
  /**
   * الحصول على عمر المعاملة بالأيام
   */
  getAge() {
    const now = new Date();
    const created = new Date(this.createdAt);
    return Math.ceil((now - created) / (1000 * 60 * 60 * 24));
  }
  
  /**
   * التحقق من جواز الانتقال لحالة معينة
   */
  canTransitionTo(newStatus) {
    const transitions = {
      [TRANSACTION_STATUS.RECEIVED]: [TRANSACTION_STATUS.IN_REGISTRATION],
      [TRANSACTION_STATUS.IN_REGISTRATION]: [TRANSACTION_STATUS.ACTIVE, TRANSACTION_STATUS.RECEIVED],
      [TRANSACTION_STATUS.ACTIVE]: [
        TRANSACTION_STATUS.FORWARDED,
        TRANSACTION_STATUS.AWAITING_RESPONSE,
        TRANSACTION_STATUS.SUSPENDED,
        TRANSACTION_STATUS.COMPLETED,
      ],
      [TRANSACTION_STATUS.FORWARDED]: [
        TRANSACTION_STATUS.ACTIVE,
        TRANSACTION_STATUS.AWAITING_RESPONSE,
        TRANSACTION_STATUS.SUSPENDED,
      ],
      [TRANSACTION_STATUS.AWAITING_RESPONSE]: [
        TRANSACTION_STATUS.ACTIVE,
        TRANSACTION_STATUS.SUSPENDED,
        TRANSACTION_STATUS.COMPLETED,
      ],
      [TRANSACTION_STATUS.SUSPENDED]: [TRANSACTION_STATUS.ACTIVE],
      [TRANSACTION_STATUS.OVERDUE]: [
        TRANSACTION_STATUS.ACTIVE,
        TRANSACTION_STATUS.COMPLETED,
        TRANSACTION_STATUS.SUSPENDED,
      ],
      [TRANSACTION_STATUS.COMPLETED]: [TRANSACTION_STATUS.ACTIVE, TRANSACTION_STATUS.ARCHIVED],
      [TRANSACTION_STATUS.ARCHIVED]: [TRANSACTION_STATUS.ACTIVE],
    };
    
    return transitions[this.status]?.includes(newStatus) || false;
  }
  
  /**
   * تحويل الكائن إلى JSON
   */
  toJSON() {
    return {
      id: this.id,
      transactionNumber: this.transactionNumber,
      subject: this.subject,
      sender: this.sender,
      senderType: this.senderType,
      externalReferenceNumber: this.externalReferenceNumber,
      documentDate: this.documentDate,
      contactInfo: this.contactInfo,
      type: this.type,
      category: this.category,
      priority: this.priority,
      tags: this.tags,
      deadline: this.deadline,
      deadlineTime: this.deadlineTime,
      status: this.status,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy,
      forwardedTo: this.forwardedTo,
      forwardedToDepartment: this.forwardedToDepartment,
      forwardingNote: this.forwardingNote,
      expectedResponseDate: this.expectedResponseDate,
      forwardingHistory: this.forwardingHistory,
      awaitingReason: this.awaitingReason,
      awaitingSince: this.awaitingSince,
      suspensionReason: this.suspensionReason,
      suspensionSince: this.suspensionSince,
      reactivationDate: this.reactivationDate,
      closedAt: this.closedAt,
      closedBy: this.closedBy,
      closingReason: this.closingReason,
      finalResponse: this.finalResponse,
      processingDuration: this.processingDuration,
      archiveLevel: this.archiveLevel,
      archivedAt: this.archivedAt,
      deletedAt: this.deletedAt,
      deletedBy: this.deletedBy,
      permanentDeleteDate: this.permanentDeleteDate,
      isConfidential: this.isConfidential,
      isPinned: this.isPinned,
      completionPercentage: this.completionPercentage,
      notes: this.notes,
    };
  }
}

export default Transaction;

/**
 * نموذج المعاملة - وارد 3.0
 */

export class Transaction {
  constructor(data) {
    this.id = data.id || null;
    this.transactionNumber = data.transactionNumber || '';
    this.subject = data.subject || '';
    this.sender = data.sender || '';
    this.senderOrganization = data.senderOrganization || '';
    this.recipient = data.recipient || '';
    this.dateReceived = data.dateReceived || new Date().toISOString();
    this.deadline = data.deadline || null;
    this.status = data.status || 'arrived'; // arrived, registering, active, directed, pending, suspended, late, completed, archived
    this.priority = data.priority || 'medium'; // low, medium, high, urgent
    this.notes = data.notes || '';
    this.attachments = data.attachments || [];
    this.history = data.history || [];
    this.assignedTo = data.assignedTo || null;
    this.department = data.department || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.deletedAt = data.deletedAt || null; // للإضافة في سلة المحذوفات
  }

  /**
   * التحقق مما إذا كانت المعاملة متأخرة
   */
  isLate() {
    if (!this.deadline) return false;
    const now = new Date();
    const deadline = new Date(this.deadline);
    return now > deadline && this.status !== 'completed' && this.status !== 'archived';
  }

  /**
   * حساب الأيام المتبقية للموعد النهائي
   */
  daysUntilDeadline() {
    if (!this.deadline) return null;
    const now = new Date();
    const deadline = new Date(this.deadline);
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * إضافة سجل إلى تاريخ المعاملة
   */
  addHistoryEntry(action, user, notes = '') {
    this.history.push({
      action,
      user,
      notes,
      timestamp: new Date().toISOString(),
    });
    this.updatedAt = new Date().toISOString();
  }

  /**
   * تغيير حالة المعاملة
   */
  changeStatus(newStatus) {
    const validStatuses = [
      'arrived',
      'registering',
      'active',
      'directed',
      'pending',
      'suspended',
      'late',
      'completed',
      'archived',
    ];
    
    if (!validStatuses.includes(newStatus)) {
      throw new Error('حالة غير صالحة');
    }
    
    this.status = newStatus;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * توجيه المعاملة لموظف أو قسم
   */
  directTo(assignedTo, department) {
    this.assignedTo = assignedTo;
    this.department = department;
    this.changeStatus('directed');
    this.addHistoryEntry('directed', assignedTo, `تم التوجيه إلى ${department}`);
  }

  /**
   * إنجاز المعاملة
   */
  complete() {
    this.changeStatus('completed');
    this.addHistoryEntry('completed', null, 'تم إنجاز المعاملة');
  }

  /**
   * أرشفة المعاملة
   */
  archive() {
    this.changeStatus('archived');
    this.addHistoryEntry('archived', null, 'تمت أرشفة المعاملة');
  }

  /**
   * حذف المعاملة (نقل لسلة المحذوفات)
   */
  softDelete() {
    this.deletedAt = new Date().toISOString();
  }

  /**
   * استعادة المعاملة من سلة المحذوفات
   */
  restore() {
    this.deletedAt = null;
  }

  /**
   * تحويل المعاملة إلى كائن عادي
   */
  toJSON() {
    return {
      id: this.id,
      transactionNumber: this.transactionNumber,
      subject: this.subject,
      sender: this.sender,
      senderOrganization: this.senderOrganization,
      recipient: this.recipient,
      dateReceived: this.dateReceived,
      deadline: this.deadline,
      status: this.status,
      priority: this.priority,
      notes: this.notes,
      attachments: this.attachments,
      history: this.history,
      assignedTo: this.assignedTo,
      department: this.department,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}

/**
 * نموذج المستخدم
 */
export class User {
  constructor(data) {
    this.id = data.id || null;
    this.username = data.username || '';
    this.email = data.email || '';
    this.fullName = data.fullName || '';
    this.role = data.role || 'user'; // admin, manager, user
    this.department = data.department || '';
    this.phone = data.phone || '';
    this.isActive = data.isActive ?? true;
    this.lastLogin = data.lastLogin || null;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
      department: this.department,
      phone: this.phone,
      isActive: this.isActive,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
    };
  }
}

/**
 * نموذج المرفق
 */
export class Attachment {
  constructor(data) {
    this.id = data.id || null;
    this.fileName = data.fileName || '';
    this.fileType = data.fileType || '';
    this.fileSize = data.fileSize || 0;
    this.fileUrl = data.fileUrl || '';
    this.uploadedAt = data.uploadedAt || new Date().toISOString();
    this.uploadedBy = data.uploadedBy || null;
  }

  toJSON() {
    return {
      id: this.id,
      fileName: this.fileName,
      fileType: this.fileType,
      fileSize: this.fileSize,
      fileUrl: this.fileUrl,
      uploadedAt: this.uploadedAt,
      uploadedBy: this.uploadedBy,
    };
  }
}

/**
 * نموذج سجل التاريخ
 */
export class HistoryEntry {
  constructor(data) {
    this.id = data.id || null;
    this.action = data.action || '';
    this.user = data.user || '';
    this.notes = data.notes || '';
    this.timestamp = data.timestamp || new Date().toISOString();
    this.previousStatus = data.previousStatus || null;
    this.newStatus = data.newStatus || null;
  }

  toJSON() {
    return {
      id: this.id,
      action: this.action,
      user: this.user,
      notes: this.notes,
      timestamp: this.timestamp,
      previousStatus: this.previousStatus,
      newStatus: this.newStatus,
    };
  }
}

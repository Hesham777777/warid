/**
 * وارد 3.0 - نموذج سجل التدقيق
 */

export class AuditLog {
  constructor(data) {
    this.id = data.id || null;
    this.transactionId = data.transactionId || null;
    this.action = data.action || ''; // create, update, change_status, forward, add_attachment, etc.
    this.field = data.field || null;
    this.oldValue = data.oldValue || null;
    this.newValue = data.newValue || null;
    this.reason = data.reason || '';
    this.userId = data.userId || null;
    this.userName = data.userName || '';
    this.userRole = data.userRole || '';
    this.timestamp = data.timestamp || new Date();
    this.appVersion = data.appVersion || '';
    this.sessionId = data.sessionId || null;
    this.ipAddress = data.ipAddress || null;
    this.deviceInfo = data.deviceInfo || '';
  }
  
  toJSON() {
    return {
      id: this.id,
      transactionId: this.transactionId,
      action: this.action,
      field: this.field,
      oldValue: this.oldValue,
      newValue: this.newValue,
      reason: this.reason,
      userId: this.userId,
      userName: this.userName,
      userRole: this.userRole,
      timestamp: this.timestamp,
      appVersion: this.appVersion,
      sessionId: this.sessionId,
      ipAddress: this.ipAddress,
      deviceInfo: this.deviceInfo,
    };
  }
}

export default AuditLog;

import AdminLog from '../models/adminLogModel.js';

export const logAdminAction = async (action, description, targetId = null, targetName = null, details = {}, req = null) => {
  try {
    const logData = {
      action,
      description,
      targetId,
      targetName,
      details,
      timestamp: new Date()
    };

    // Add IP address and user agent if request object is provided
    if (req) {
      logData.ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
      logData.userAgent = req.headers['user-agent'];
    }

    const adminLog = new AdminLog(logData);
    await adminLog.save();
    
    console.log(`[ADMIN LOG] ${action}: ${description}`);
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};

// Predefined log messages for common actions
export const LOG_MESSAGES = {
  LOGIN: 'Admin logged in successfully',
  LOGOUT: 'Admin logged out',
  APPROVE_DOCTOR: 'Doctor approved',
  REJECT_DOCTOR: 'Doctor rejected',
  DELETE_DOCTOR: 'Doctor deleted',
  CHANGE_DOCTOR_AVAILABILITY: 'Doctor availability changed',
  CANCEL_APPOINTMENT: 'Appointment cancelled',
  CANCEL_ALL_APPOINTMENTS: 'All active appointments cancelled',
  ADD_DOCTOR: 'New doctor added',
  VIEW_DASHBOARD: 'Dashboard viewed',
  VIEW_DOCTORS: 'Doctor list viewed',
  VIEW_APPOINTMENTS: 'Appointments list viewed',
  VIEW_PENDING_DOCTORS: 'Pending doctors list viewed'
}; 
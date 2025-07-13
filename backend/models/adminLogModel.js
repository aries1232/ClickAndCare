import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'APPROVE_DOCTOR',
      'REJECT_DOCTOR',
      'DELETE_DOCTOR',
      'CHANGE_DOCTOR_AVAILABILITY',
      'CANCEL_APPOINTMENT',
      'CANCEL_ALL_APPOINTMENTS',
      'ADD_DOCTOR',
      'VIEW_DASHBOARD',
      'VIEW_DOCTORS',
      'VIEW_APPOINTMENTS',
      'VIEW_PENDING_DOCTORS',
      // Added actions:
      'UPDATE_DOCTOR',
      'UPDATE_DOCTOR_PICTURE',
      'TOGGLE_DOCTOR_VISIBILITY',
      'REMOVE_RECOVERY_EMAIL',
      'TOGGLE_RECOVERY_EMAIL',
      'FORGOT_PASSWORD',
      'RESET_PASSWORD',
      'ADD_RECOVERY_EMAIL',
      'CHANGE_ADMIN_EMAIL'
    ]
  },
  description: {
    type: String,
    required: true
  },
  targetId: {
    type: String,
    default: null
  },
  targetName: {
    type: String,
    default: null
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
adminLogSchema.index({ timestamp: -1 });
adminLogSchema.index({ action: 1 });
adminLogSchema.index({ targetId: 1 });

const AdminLog = mongoose.model('AdminLog', adminLogSchema);

export default AdminLog; 
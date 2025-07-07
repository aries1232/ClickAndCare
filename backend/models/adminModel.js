import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    recoveryEmails: [{
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    resetOTP: {
        code: String,
        expiresAt: Date
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
adminSchema.index({ email: 1 });
adminSchema.index({ 'recoveryEmails.email': 1 });

const Admin = mongoose.model('Admin', adminSchema);

export default Admin; 
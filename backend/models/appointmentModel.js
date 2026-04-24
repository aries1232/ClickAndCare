import mongoose from "mongoose";
const appointmentSchema = new mongoose.Schema({
    userId:{type: String ,required:true},
    docId:{type: String ,required:true},
    slotDate:{type: String ,required:true},
    slotTime:{type: String ,required:true},
    userData:{type: Object ,required:true},
    docData:{type: Object ,required:true},
    amount:{type: Number ,required:true},
    date:{type: Number,required:true},
    cancelled:{type: Boolean ,default:false},
    payment:{type: Boolean ,default:false},
    isCompleted:{type: Boolean ,default:false},
    // Soft-lock window for the BMS-style booking flow. While `lockExpiresAt`
    // is in the future the slot is treated as taken (see availability query
    // in userController.bookAppointment / doctorController.getBookedSlots).
    // The webhook flips it to `null` once payment succeeds; the row otherwise
    // stays as a record but stops blocking new bookings once the lock expires.
    lockExpiresAt:{type: Date, default: null}
})

appointmentSchema.index({ docId: 1, slotDate: 1, slotTime: 1 });

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema);
export default appointmentModel;

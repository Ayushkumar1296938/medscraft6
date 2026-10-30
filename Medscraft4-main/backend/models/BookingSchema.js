import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: false, // Optional for dashboard-created appointments
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false, // Optional for dashboard-created appointments
    },
    patientName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    mobile: { type: String },
    gender: { type: String },
    address: { type: String },
    consultingDoctor: { type: String },
    treatment: { type: String, default: "General Consultation" },
    notes: { type: String },
    ticketPrice: { 
      type: String, 
      required: false, 
      default: "0" 
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    appointmentDate: { type: String, required: false }, // Flexible for strings or dates
    appointmentTime: { type: String, required: false },
    session: { type: String },
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    strictPopulate: false,
  }).populate({
    path: 'doctor',
    select: 'name',
    strictPopulate: false,
  });
  next();
});

export default mongoose.model("Booking", bookingSchema);
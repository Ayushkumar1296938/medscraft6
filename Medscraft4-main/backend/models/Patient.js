
import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  name: { type: String },
  username: { type: String },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dob: { type: String },
  gender: { type: String },
  education: { type: String },
  designation: { type: String },
  department: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  state: { type: String },
  postalCode: { type: String },
  biography: { type: String },
  status: { type: String, default: 'Active' },
  avatarName: { type: String }
}, { timestamps: true });

const Patient =
  mongoose.models.Patient ||
  mongoose.model('Patient', patientSchema);

export default Patient;

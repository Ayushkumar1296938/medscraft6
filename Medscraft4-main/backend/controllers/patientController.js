
import Patient from '../models/Patient.js';

// Create a new patient
const createPatient = async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();

    return res.status(201).json({
      message: 'Patient added successfully',
      patient: newPatient
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'A patient with this identifier/email already exists.'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};

// Get all patients
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    return res.status(200).json(patients);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get one patient by ID
const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    return res.status(200).json(patient);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Get patient by ID for internal use
const getPatientById = async (id) => {
  const patient = await Patient.findById(id);

  if (!patient) {
    throw new Error('Patient not found');
  }

  return patient;
};

// Update patient
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    return res.status(200).json(patient);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete patient
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    return res.status(200).json({
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Export controller functions
export default {
  createPatient,
  getPatients,
  getPatient,
  getPatientById,
  updatePatient,
  deletePatient
};

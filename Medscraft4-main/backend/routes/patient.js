
import express from 'express';
import patientController from '../controllers/patientController.js';

const router = express.Router();

// Render views (if server-side rendering is used)
router.get('/create', (req, res) => {
  res.render('createPatient');
});

// Render update page
router.get('/update/:id', async (req, res, next) => {
  try {
    const patient = await patientController.getPatientById(req.params.id);
    return res.render('updatePatient', { patient });
  } catch (error) {
    next(error);
  }
});

// Render delete page
router.get('/delete/:id', async (req, res, next) => {
  try {
    const patient = await patientController.getPatientById(req.params.id);
    return res.render('deletePatient', { patient });
  } catch (error) {
    next(error);
  }
});

// API routes
router.post('/', patientController.createPatient);
router.get('/', patientController.getPatients);
router.get('/:id', patientController.getPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

export default router;

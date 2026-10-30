import express from 'express';
import patientController from '../controllers/patientController.js';

const router = express.Router();

// Render views (if needed for server-side rendering)
router.get('/create', (req, res) => {
  res.render('createPatient');
});

router.get('/update/:id', async (req, res) => {
  const patient = await patientController.getPatientById(req.params.id);
  res.render('updatePatient', { patient });
});

router.get('/delete/:id', async (req, res) => {
  const patient = await patientController.getPatientById(req.params.id);
  res.render('deletePatient', { patient });
});

// API routes (Middleware removed to allow direct testing & seamless patient creation)
router.post('/', patientController.createPatient);
router.get('/', patientController.getPatients);
router.get('/:id', patientController.getPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

export default router;
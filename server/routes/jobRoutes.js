const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/', jobController.getJobs);
router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);
router.get('/match/:jobId/:candidateId', jobController.matchCandidate);

module.exports = router;

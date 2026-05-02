const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists or create it
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/', candidateController.getCandidates);
router.post('/', candidateController.createCandidate);
router.get('/:id', candidateController.getCandidateById);
router.put('/:id', candidateController.updateCandidate);
router.delete('/:id', candidateController.deleteCandidate);
router.post('/enrich', candidateController.enrichCandidate);
router.post('/upload', upload.single('resume'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Please upload a file' });
    res.json({ message: 'File uploaded successfully', filePath: `/uploads/${req.file.filename}` });
});

module.exports = router;

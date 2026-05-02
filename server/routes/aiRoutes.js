const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/chat', aiController.chat);
router.get('/expand', aiController.expand);
router.post('/generate-jd', aiController.generateJD);
router.post('/upload-cv', upload.single('file'), aiController.uploadCV);
router.post('/ask-cv', aiController.askCV);
router.post('/parse-cv', upload.single('file'), aiController.parseCV);

module.exports = router;

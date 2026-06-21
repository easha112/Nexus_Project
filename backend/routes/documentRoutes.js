const express = require('express');
const { uploadDocument, getUserDocuments, addSignature } = require('../controllers/documentController');
const upload = require('../middleware/upload');

const router = express.Router();

// single('file') matches the field name coming from frontend form-data
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/user/:userId', getUserDocuments);
router.put('/:id/sign', addSignature);

module.exports = router;
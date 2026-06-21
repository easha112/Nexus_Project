const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

// @desc    Upload a document
// @route   POST /api/documents/upload
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a valid file (PDF or Image).' });
    }

    const { title, uploadedBy } = req.body;

    const newDoc = new Document({
      title: title || req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      uploadedBy
    });

    const savedDoc = await newDoc.save();
    res.status(201).json({ message: 'Document uploaded successfully', document: savedDoc });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all documents for a user
// @route   GET /api/documents/user/:userId
const getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.params.userId });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add E-Signature to document
// @route   PUT /api/documents/:id/sign
const addSignature = async (req, res) => {
  try {
    const { signatureImage } = req.body;
    
    if (!signatureImage) {
      return res.status(400).json({ message: 'Signature image data is required.' });
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    document.signatureImage = signatureImage;
    document.status = 'Signed';
    
    const updatedDoc = await document.save();
    res.json({ message: 'Document signed successfully', document: updatedDoc });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  uploadDocument,
  getUserDocuments,
  addSignature
};
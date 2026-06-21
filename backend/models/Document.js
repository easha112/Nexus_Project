const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  filename: { 
    type: String, 
    required: true 
  },
  path: { 
    type: String, 
    required: true 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Signed'], 
    default: 'Pending' 
  },
  signatureImage: { 
    type: String, // Store base64 string or URL of the e-signature
    default: '' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
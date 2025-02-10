const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['devam-ediyor', 'tamamlandi'],
    default: 'devam-ediyor'
  },
  images: [{
    type: String // Resim URL'leri için
  }],
  features: [{
    type: String // Örnek: "5+1", "200m2", "Havuz" vb.
  }],
  completionDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema); 
const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// Tüm aktif hizmetleri getir (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tüm hizmetleri getir (admin için - aktif/pasif hepsi)
router.get('/all', auth, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tekil hizmet getir
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Hizmet bulunamadı' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni hizmet ekle
router.post('/', auth, async (req, res) => {
  try {
    const service = new Service(req.body);
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Hizmet güncelle
router.put('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Hizmet bulunamadı' });
    }
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Hizmet sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Hizmet bulunamadı' });
    }
    res.json({ message: 'Hizmet başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
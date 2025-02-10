const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// Tüm projeleri getir (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tekil proje getir (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni proje ekle (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Proje güncelle (auth required)
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Proje sil (auth required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }

    // Önce projeye ait tüm resimleri sil
    for (const imagePath of project.images) {
      const fileName = imagePath.split('/').pop(); // /uploads/projects/image.jpg -> image.jpg
      const fullPath = path.join(__dirname, '../uploads/projects', fileName);
      
      // Dosyayı fiziksel olarak sil
      fs.unlink(fullPath, (err) => {
        if (err) console.error('Dosya silinirken hata:', err);
      });
    }

    // Sonra projeyi veritabanından sil
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Proje ve resimleri başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Resim yükleme endpoint'i
router.post('/:id/images', auth, upload.array('images', 5), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }

    const imageUrls = req.files.map(file => `/uploads/projects/${file.filename}`);
    
    // Mevcut resimlere yenilerini ekle
    project.images = [...project.images, ...imageUrls];
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Tekil resim silme endpoint'i
router.delete('/:id/images/:imageName', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }

    const imagePath = `/uploads/projects/${req.params.imageName}`;
    const fullPath = path.join(__dirname, '../uploads/projects', req.params.imageName);
    
    // Resmi diziden kaldır
    project.images = project.images.filter(img => img !== imagePath);
    await project.save();

    // Dosyayı fiziksel olarak sil
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error('Dosya silinirken hata:', err);
        return res.status(500).json({ message: 'Dosya silinirken hata oluştu' });
      }
      res.json({ message: 'Resim başarıyla silindi', project });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
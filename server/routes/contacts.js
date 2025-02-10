const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

// Form gönderme (public)
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const savedContact = await contact.save();
    res.status(201).json({
      message: 'Mesajınız başarıyla iletildi',
      contact: savedContact
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Tüm mesajları getir (admin)
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Okunmamış mesaj sayısını getir (admin)
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Contact.countDocuments({ isRead: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mesajı okundu olarak işaretle (admin)
router.patch('/:id/mark-as-read', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Mesaj bulunamadı' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mesaj durumunu güncelle (admin)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Mesaj bulunamadı' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mesaj sil (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Mesaj bulunamadı' });
    }
    res.json({ message: 'Mesaj başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
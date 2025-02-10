const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');
const BlacklistedToken = require('../models/BlacklistedToken');

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Admin'i bul
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    // Şifreyi kontrol et
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    // Son giriş tarihini güncelle
    admin.lastLogin = new Date();
    await admin.save();

    // Token oluştur
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        fullName: admin.fullName
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Mevcut admin bilgilerini getir
router.get('/me', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    // Token'ı blacklist'e ekle
    await BlacklistedToken.create({ token: req.token });
    res.json({ message: 'Başarıyla çıkış yapıldı' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router; 
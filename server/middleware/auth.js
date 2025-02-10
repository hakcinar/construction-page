const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    // Token blacklist kontrolü
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Oturum sonlandırılmış' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    req.token = token; // token'ı request nesnesine ekle
    next();
  } catch (error) {
    res.status(401).json({ message: 'Geçersiz token' });
  }
};

module.exports = auth; 
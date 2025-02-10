const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const serviceRoutes = require('./routes/services');
const contactRoutes = require('./routes/contacts');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API çalışıyor' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contacts', contactRoutes);

// Statik dosya servisi
app.use('/uploads', express.static('uploads'));

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB bağlantısı başarılı');
  // Server başlatma
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
  });
})
.catch((err) => {
  console.error('MongoDB bağlantı hatası:', err);
  process.exit(1);
}); 
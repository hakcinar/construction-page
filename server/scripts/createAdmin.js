const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function createInitialAdmin() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('MongoDB URI:', uri);
    
    if (!uri) {
      throw new Error('.env dosyasından MONGODB_URI okunamadı');
    }

    await mongoose.connect(uri);
    
    const adminExists = await Admin.findOne({ username: 'admin' });
    
    if (!adminExists) {
      await Admin.create({
        username: 'admin',
        password: 'admin123', // Hash'lenecek
        fullName: 'Admin User'
      });
      console.log('İlk admin oluşturuldu');
    } else {
      console.log('Admin zaten mevcut');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

createInitialAdmin(); 
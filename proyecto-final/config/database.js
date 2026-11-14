const mongoose = require('mongoose');

async function connectDB() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('❌ DATABASE_URL no está definida');
    process.exit(1);
  }
  try {
    await mongoose.connect(url, { serverSelectionTimeoutMS: 10000 });
    console.log(`✅ MongoDB conectado: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
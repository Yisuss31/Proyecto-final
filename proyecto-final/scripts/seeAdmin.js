// Crea/promueve un admin desde variables de entorno.
// Uso: ADMIN_EMAIL=admin@x.com ADMIN_PASSWORD=Secret123! npm run seed:admin
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');

async function main() {
  const email = process.env.ADMIN_EMAIL || process.argv[2];
  const password = process.env.ADMIN_PASSWORD || process.argv[3];
  const nombre = process.env.ADMIN_NAME || 'Administrador';

  if (!email || !password) {
    console.error('❌ Falta ADMIN_EMAIL y/o ADMIN_PASSWORD');
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    existing.rol = 'admin';
    await existing.save();
    console.log(`✅ Usuario ${email} promovido a admin`);
  } else {
    await User.create({ nombre, email, password, rol: 'admin' });
    console.log(`✅ Admin creado: ${email}`);
  }
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
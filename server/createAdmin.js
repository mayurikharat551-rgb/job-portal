require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

(async () => {
  await connectDB();
  const email = 'mayurikharat8080@gmail.com';
  const plainPassword = '1234567890';
  const passwordHash = await User.hashPassword(plainPassword);

  let adminUser = await User.findOne({ email });
  if (adminUser) {
    adminUser.passwordHash = passwordHash;
    adminUser.role = 'admin';
    adminUser.name = 'Mayuri Kharat (Admin)';
    await adminUser.save();
    console.log(`✅ Admin account updated for ${email}`);
  } else {
    adminUser = await User.create({
      name: 'Mayuri Kharat (Admin)',
      email,
      passwordHash,
      role: 'admin',
    });
    console.log(`✅ Admin account created for ${email}`);
  }

  console.log(`Admin Email: ${email}`);
  console.log(`Admin Role: ${adminUser.role}`);
  console.log(`Admin Name: ${adminUser.name}`);

  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

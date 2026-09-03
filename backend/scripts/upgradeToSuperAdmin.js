const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const upgradeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const admin = await User.findOne({ email: 'superadmin@example.com' });
    if (!admin) {
      console.log('superadmin@example.com not found! Exiting.');
      process.exit();
    }

    admin.role = 'superadmin';
    await admin.save();

    console.log('Successfully upgraded superadmin@example.com to superadmin!');
    process.exit();
  } catch (error) {
    console.error('Error upgrading admin:', error);
    process.exit(1);
  }
};

upgradeAdmin();

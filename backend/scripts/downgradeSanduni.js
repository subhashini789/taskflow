const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const downgradeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      console.log('admin@example.com not found! Exiting.');
      process.exit();
    }

    // Downgrade back to regular admin
    admin.role = 'admin';
    await admin.save();

    console.log('Successfully removed superadmin role from admin@example.com (Sanduni)! They are now a regular admin.');
    process.exit();
  } catch (error) {
    console.error('Error downgrading admin:', error);
    process.exit(1);
  }
};

downgradeAdmin();

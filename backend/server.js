const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('MongoDB Connected');
  
  // Automatically seed the superadmin account if it doesn't exist
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('superadmin123', salt);
    
    const adminExists = await User.findOne({ email: 'superadmin@example.com' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: hashedPassword,
        role: 'superadmin',
      });
      console.log('Superadmin account created for live database.');
    } else {
      adminExists.password = hashedPassword;
      adminExists.role = 'superadmin';
      await adminExists.save();
      console.log('Superadmin account updated for live database.');
    }
  } catch (err) {
    console.error('Error seeding superadmin:', err);
  }
})
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const User = require('../models/User');

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'superadmin@gmail.com', 
        password: 'superadmin1234', // Will be hashed automatically by pre-save hook
        role: 'admin', 
        interests: ['management', 'chess'] 
      });
      console.log('✅ Default Admin created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

module.exports = createDefaultAdmin;

const bcrypt = require('bcryptjs');
const models = require('../models');

const fixAdminPassword = async () => {
  try {
    console.log('🔧 Updating admin password...');
    
    // Find admin user
    const admin = await models.User.findOne({ where: { email: 'admin@camino.travel' } });
    
    if (!admin) {
      console.log('❌ Admin user not found. Creating new admin user...');
      const password_hash = await bcrypt.hash('admin123', 10);
      await models.User.create({
        name: 'Admin User',
        email: 'admin@camino.travel',
        password_hash,
        role: 'admin',
        email_verified: true,
      });
      console.log('✅ Admin user created successfully!');
    } else {
      // Update password
      const password_hash = await bcrypt.hash('admin123', 10);
      admin.password_hash = password_hash;
      await admin.save();
      console.log('✅ Admin password updated successfully!');
      
      // Verify password
      const isValid = await bcrypt.compare('admin123', admin.password_hash);
      if (isValid) {
        console.log('✅ Password verification: PASSED');
      } else {
        console.log('❌ Password verification: FAILED');
      }
    }
    
    // Also fix editor passwords
    console.log('\n🔧 Updating editor passwords...');
    const editors = await models.User.findAll({ where: { role: 'editor' } });
    for (const editor of editors) {
      let newPassword;
      if (editor.email === 'editor@camino.travel') {
        newPassword = 'editor123';
      } else if (editor.email === 'editorial@camino.travel') {
        newPassword = 'editorial123';
      } else {
        continue;
      }
      
      const password_hash = await bcrypt.hash(newPassword, 10);
      editor.password_hash = password_hash;
      await editor.save();
      console.log(`✅ Updated password for ${editor.email}`);
    }
    
    console.log('\n✅ All passwords fixed successfully!');
    console.log('\n📋 Login credentials:');
    console.log('   Admin: admin@camino.travel / admin123');
    console.log('   Editor: editor@camino.travel / editor123');
    console.log('   Editorial: editorial@camino.travel / editorial123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing passwords:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  fixAdminPassword();
}

module.exports = fixAdminPassword;


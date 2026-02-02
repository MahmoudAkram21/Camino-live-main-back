const bcrypt = require('bcryptjs');
const models = require('../../models');

const seedUsers = async (models) => {
  const usersData = [
    {
      name: 'Admin User',
      email: 'admin@camino.travel',
      password_hash: await bcrypt.hash('admin123', 10),
      role: 'admin',
      email_verified: true,
    },
    {
      name: 'Editor User',
      email: 'editor@camino.travel',
      password_hash: await bcrypt.hash('editor123', 10),
      role: 'editor',
      email_verified: true,
    },
    {
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@example.com',
      password_hash: await bcrypt.hash('password123', 10),
      role: 'user',
      email_verified: true,
    },
    {
      name: 'James Thompson',
      email: 'james.thompson@example.com',
      password_hash: await bcrypt.hash('password123', 10),
      role: 'user',
      email_verified: true,
    },
    {
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      password_hash: await bcrypt.hash('password123', 10),
      role: 'user',
      email_verified: true,
    },
    {
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      password_hash: await bcrypt.hash('password123', 10),
      role: 'user',
      email_verified: true,
    },
    {
      name: 'Sophie Anderson',
      email: 'sophie.anderson@example.com',
      password_hash: await bcrypt.hash('password123', 10),
      role: 'user',
      email_verified: true,
    },
    {
      name: 'David Parker',
      email: 'david.parker@example.com',
      password_hash: await bcrypt.hash('password123', 10),
      role: 'user',
      email_verified: true,
    },
    {
      name: 'Camino Editorial',
      email: 'editorial@camino.travel',
      password_hash: await bcrypt.hash('editorial123', 10),
      role: 'editor',
      email_verified: true,
    },
  ];

  const users = [];
  for (const userData of usersData) {
    const [user, created] = await models.User.findOrCreate({
      where: { email: userData.email },
      defaults: userData,
    });
    users.push(user);
  }

  return users;
};

module.exports = seedUsers;


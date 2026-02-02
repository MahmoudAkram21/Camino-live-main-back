const models = require('../../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// Get all users with pagination and filters
const getAllUsers = async (req, res) => {
  try {
    const {
      search,
      role, // 'admin', 'editor', 'user'
      status, // 'active', 'inactive', 'all'
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = req.query;

    const where = {};

    if (status === 'active') where.is_active = true;
    else if (status === 'inactive') where.is_active = false;

    if (role) where.role = role;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await models.User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] }, // Exclude password from response
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching users (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch users',
        details: error.message,
      },
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await models.User.findByPk(id, {
      attributes: { exclude: ['password'] }, // Exclude password from response
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
        },
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user (Admin):', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch user',
        details: error.message,
      },
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      date_of_birth,
      country,
      city,
      address,
      is_active,
      password,
    } = req.body;

    const user = await models.User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
        },
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await models.User.findOne({
        where: { email, id: { [Op.ne]: id } },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Email already in use',
          },
        });
      }
      user.email = email;
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (date_of_birth !== undefined) user.date_of_birth = date_of_birth;
    if (country !== undefined) user.country = country;
    if (city !== undefined) user.city = city;
    if (address !== undefined) user.address = address;
    if (is_active !== undefined) user.is_active = Boolean(is_active);

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const updatedUser = await models.User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update user',
        details: error.message,
      },
    });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['admin', 'editor', 'user'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Role must be one of: ${validRoles.join(', ')}`,
        },
      });
    }

    // Prevent changing own role
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'You cannot change your own role',
        },
      });
    }

    const user = await models.User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
        },
      });
    }

    user.role = role;
    await user.save();

    const updatedUser = await models.User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update user role',
        details: error.message,
      },
    });
  }
};

// Delete user (soft delete)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { hard = false } = req.query;

    // Prevent deleting own account
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'You cannot delete your own account',
        },
      });
    }

    const user = await models.User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
        },
      });
    }

    if (hard === 'true' || hard === true) {
      // Check if user has associated data
      const reviewsCount = await models.Review.count({ where: { user_id: id } });
      const tripsCount = await models.Trip.count({ where: { created_by: id } });
      const articlesCount = await models.JournalArticle.count({ where: { created_by: id } });

      if (reviewsCount > 0 || tripsCount > 0 || articlesCount > 0) {
        return res.status(400).json({
          success: false,
          error: {
            message: `Cannot permanently delete user with associated data (${reviewsCount} reviews, ${tripsCount} trips, ${articlesCount} articles). Use soft delete instead.`,
          },
        });
      }

      await user.destroy();
      res.json({
        success: true,
        message: 'User permanently deleted',
      });
    } else {
      // Soft delete
      user.is_active = false;
      await user.save();
      res.json({
        success: true,
        message: 'User deactivated successfully',
      });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete user',
        details: error.message,
      },
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
};

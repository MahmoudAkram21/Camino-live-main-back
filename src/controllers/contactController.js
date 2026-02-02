const models = require('../models');

const submitContact = async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;

    if (!email || !message) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and message are required' },
      });
    }

    const lead = await models.ContactLead.create({
      name: name || null,
      email,
      message,
      phone: phone || null,
      status: 'new',
    });

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: lead,
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to submit contact form' },
    });
  }
};

module.exports = { submitContact };


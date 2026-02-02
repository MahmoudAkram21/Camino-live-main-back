const models = require('../models');

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email is required' },
      });
    }

    const [subscription, created] = await models.NewsletterSubscription.findOrCreate({
      where: { email },
      defaults: { is_active: true },
    });

    if (!created && subscription.is_active) {
      return res.json({
        success: true,
        message: 'Email is already subscribed',
        data: subscription,
      });
    }

    if (!created && !subscription.is_active) {
      subscription.is_active = true;
      subscription.unsubscribed_at = null;
      await subscription.save();
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: subscription,
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to subscribe to newsletter' },
    });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email is required' },
      });
    }

    const subscription = await models.NewsletterSubscription.findOne({ where: { email } });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: { message: 'Email not found in subscriptions' },
      });
    }

    subscription.is_active = false;
    subscription.unsubscribed_at = new Date();
    await subscription.save();

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to unsubscribe from newsletter' },
    });
  }
};

module.exports = { subscribe, unsubscribe };


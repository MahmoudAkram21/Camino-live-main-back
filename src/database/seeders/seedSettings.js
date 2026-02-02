const models = require('../../models');

const seedSettings = async (models) => {
  const settingsData = [
    {
      setting_key: 'site_name',
      setting_value: 'Camino Travel',
      setting_type: 'text',
      description: 'Site Name',
    },
    {
      setting_key: 'site_description',
      setting_value: 'Discover Slow Travel',
      setting_type: 'text',
      description: 'Site Description',
    },
    {
      setting_key: 'site_email',
      setting_value: 'hello@camino.travel',
      setting_type: 'email',
      description: 'Contact Email',
    },
    {
      setting_key: 'site_phone',
      setting_value: '+44 20 1234 5678',
      setting_type: 'text',
      description: 'Contact Phone',
    },
    {
      setting_key: 'default_currency',
      setting_value: 'EUR',
      setting_type: 'text',
      description: 'Default Currency',
    },
    {
      setting_key: 'facebook_url',
      setting_value: 'https://facebook.com/caminotravel',
      setting_type: 'url',
      description: 'Facebook Page URL',
    },
    {
      setting_key: 'instagram_url',
      setting_value: 'https://instagram.com/caminotravel',
      setting_type: 'url',
      description: 'Instagram Profile URL',
    },
    {
      setting_key: 'twitter_url',
      setting_value: 'https://twitter.com/caminotravel',
      setting_type: 'url',
      description: 'Twitter Profile URL',
    },
  ];

  const createdSettings = [];
  for (const settingData of settingsData) {
    const [setting, created] = await models.SiteSetting.findOrCreate({
      where: { setting_key: settingData.setting_key },
      defaults: settingData,
    });
    createdSettings.push(setting);
  }

  return createdSettings;
};

module.exports = seedSettings;


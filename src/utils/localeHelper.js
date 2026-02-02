/**
 * Get localized field value based on language preference
 * @param {Object} data - The data object containing the fields
 * @param {string} fieldName - Base field name (e.g., 'title', 'description')
 * @param {string} locale - Language code ('en' or 'ar')
 * @returns {string|null} - The localized value or fallback
 */
function getLocalizedField(data, fieldName, locale = 'en') {
  if (!data) return null;
  
  // Try locale-specific field first (e.g., title_ar, title_en)
  const localizedField = `${fieldName}_${locale}`;
  if (data[localizedField] !== undefined && data[localizedField] !== null && data[localizedField] !== '') {
    return data[localizedField];
  }
  
  // Fallback to base field
  if (data[fieldName] !== undefined && data[fieldName] !== null && data[fieldName] !== '') {
    return data[fieldName];
  }
  
  // Try other locale as last resort
  const otherLocale = locale === 'en' ? 'ar' : 'en';
  const otherLocalizedField = `${fieldName}_${otherLocale}`;
  if (data[otherLocalizedField] !== undefined && data[otherLocalizedField] !== null && data[otherLocalizedField] !== '') {
    return data[otherLocalizedField];
  }
  
  return null;
}

/**
 * Transform an object to use localized fields
 * @param {Object} data - The data object
 * @param {string[]} fields - Array of field names to localize
 * @param {string} locale - Language code ('en' or 'ar')
 * @returns {Object} - Transformed object with localized values
 */
function transformLocalizedFields(data, fields, locale = 'en') {
  if (!data) return data;
  
  const transformed = { ...data };
  
  fields.forEach(fieldName => {
    const localizedValue = getLocalizedField(data, fieldName, locale);
    if (localizedValue !== null) {
      transformed[fieldName] = localizedValue;
    }
  });
  
  return transformed;
}

/**
 * Get locale from request (query param, header, or default to 'en')
 * @param {Object} req - Express request object
 * @returns {string} - Language code ('en' or 'ar')
 */
function getLocaleFromRequest(req) {
  // Check query parameter first
  if (req.query?.locale && ['en', 'ar'].includes(req.query.locale)) {
    return req.query.locale;
  }
  
  // Check Accept-Language header
  // Express normalizes headers to lowercase, so use 'accept-language'
  const acceptLanguage = req.headers['accept-language'] || req.headers['Accept-Language'];
  
  if (acceptLanguage) {
    // Handle both 'ar' and 'ar-*' formats
    if (acceptLanguage.toLowerCase().startsWith('ar')) {
      return 'ar';
    }
    // Explicitly check for 'en' as well
    if (acceptLanguage.toLowerCase().startsWith('en')) {
      return 'en';
    }
  }
  
  // Default to English
  return 'en';
}

module.exports = {
  getLocalizedField,
  transformLocalizedFields,
  getLocaleFromRequest,
};


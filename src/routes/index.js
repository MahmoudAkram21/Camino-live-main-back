module.exports = (app) => {
  // Import route modules
  require('./publicRoutes')(app);
  require('./authRoutes')(app);
  require('./adminRoutes')(app);
  
  console.log('✅ Routes loaded successfully');
};


const basicAuth = require('express-basic-auth');

// Simple Basic Auth Middleware
const authMiddleware = basicAuth({
  users: { 
    'admin': process.env.ADMIN_PASSWORD || 'aos2025!',
    'viewer': process.env.VIEWER_PASSWORD || 'viewer123'
  },
  challenge: true,
  realm: 'AoS Collection',
  unauthorizedResponse: (req) => {
    return {
      error: 'Unauthorized',
      message: 'Please provide valid credentials to access the AoS Collection'
    };
  }
});

// Role-based access
const requireRole = (role) => {
  return (req, res, next) => {
    const user = req.auth?.user;
    
    if (role === 'admin' && user !== 'admin') {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Admin access required' 
      });
    }
    
    next();
  };
};

module.exports = { authMiddleware, requireRole };
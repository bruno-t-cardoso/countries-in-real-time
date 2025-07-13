const xss = require('xss');
const mongoSanitize = require('express-mongo-sanitize');

// XSS Protection middleware
const xssProtection = (req, res, next) => {
  // Sanitize request body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = xss(req.query[key]);
      }
    });
  }

  // Sanitize route parameters
  if (req.params) {
    Object.keys(req.params).forEach(key => {
      if (typeof req.params[key] === 'string') {
        req.params[key] = xss(req.params[key]);
      }
    });
  }

  next();
};

// NoSQL Injection Protection
const noSQLProtection = mongoSanitize({
  replaceWith: '_'
});

module.exports = {
  xssProtection,
  noSQLProtection
};
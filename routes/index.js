var express = require('express');
var router = express.Router();

// Home page route
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Register route
router.get('/register', (req, res) => {
  res.render('register');
});

// Login route
router.get('/login', (req, res) => {
  res.render('login');
});

// Export router
module.exports = router;

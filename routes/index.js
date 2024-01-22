var express = require('express');
var router = express.Router();

// Home page route
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Secondary register route
router.get('/register.html', (req, res) => {
  res.render('register');
});

/*
// Register route
router.get('/register', (req, res) => {
  res.render('register');
});
*/

// Secondary login route
router.get('/login.html', (req, res) => {
  res.render('login');
});

/*
// Login route
router.get('/login', (req, res) => {
  res.render('login');
});
*/

// Export router
module.exports = router;

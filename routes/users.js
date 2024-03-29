var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const {body, validationResult } = require("express-validator");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const validateToken = require("../auth/validateToken.js")

// Get user list get method
router.get('/list', validateToken, (req, res, next) => {
  User.find({}, (err, users) =>{
    if(err) return next(err);
    res.render("users", {users});
  })
  
});

// Render login page
router.get('/login', (req, res, next) => {
  res.render('login');
});

// Login post method
router.post('/login', 
  (req, res, next) => {
    const username = req.body.email; 
    const password = req.body.password; 
    console.log(`Attempting login as ${username} with password ${password}...`);
    User.findOne({username: username}, (err, user) =>{
    if(err) throw err;
    if(!user) {
      return res.status(403).json({message: "User does not exist."});
    } else {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch) {
          console.log("Correct password!")
          const jwtPayload = {
            id: user._id,
            username: user.username
          }
          jwt.sign(jwtPayload, 'auth_token', {expiresIn: 120},
            (err, token) => {
              if (err) {
                console.error(err);
              }
              return res.status(200).json({ success:true, token:token });
            }
          );
        } else {
          console.log("Incorrect password.")
        }
      })
    }

    })

});

// Render register page
router.get('/register', (req, res, next) => {
  res.render('register');
});

// Register post method
router.post('/register',
  (req, res, next) => {
    const username = req.body.email; 
    const password = req.body.password; 
    if (!username) {
      return res.status(403).json({message: "Invalid username."});
    } else if (!password) {
      return res.status(403).json({message: "Invalid password."});
    }
    console.log(`Registering user with username: ${username} and password ${password}`);
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      console.log('Registration failed.')
      return res.status(400).json({errors: errors.array()});
    }
    User.findOne({username: username}, (err, user) => {
      if(err) {
        console.log('Registration failed.')
        console.log(err);
        throw err
      };
      if(user){
        console.log('Registration failed. Username already in use.')
        return res.status(403).json({username: "Username already in use."});
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if(err) throw err;
            console.log(`Hashed password: ${hash}`);
            User.create(
              {
                username: username,
                password: hash
              },
              (err, ok) => {
                if(err) throw err;
                console.log("Successfully created user.")
                return res.status(200).redirect("/login.html");
              }
            );
          });
        });
      }
    });
});

// Export router
module.exports = router;
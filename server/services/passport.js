const passport = require('passport');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const { getUserWithEmail } = require("../helpers/auth");

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  getUserWithEmail(email)
  .then(user => {
        // if (err) { return done(err); }
        if (!user) { return done(null, false); }
        // compare passwords - is `password` equal to user.password?
        return done(null, user);        
      })
      .catch(err => console.log(`error on logIn:${err}`)) 
});


// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.JWT_SECRET
  };
  
  // Create JWT strategy
  const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // See if the email in the payload exists in our database
    // If it does, call 'done' with that other
    // otherwise, call done without a user object
    getUserWithEmail(payload.email)
    .then( user => {
      
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        })
        .catch(err => console.log(`error on RequireAuth:${err}`))
  });


// Tell passport to use this strategy
passport.use(localLogin);
passport.use(jwtLogin);

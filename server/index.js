require('dotenv').config()

const PORT = process.env.PORT || 8001;
const express = require("express");
const bodyparser = require("body-parser");
const passportService = require('./services/passport');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { tokenForUser, getUserWithEmail, verifyToken } = require("./helpers/auth");
const app = express();

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

app.use(bodyparser.json());



app.get("/hello", (req, res)=>{
    res.send(`hello there! it works...`)
  })

app.post("/signin", (req, res)=>{
    const {email, password} = req.body
    const user = {email, password}
    if (getUserWithEmail(user)){
        let token = tokenForUser(user)
        res.send({token, user})
    } else {
        res.send(`login failed...`)
    }
  })

  app.get("/protected", (req, res)=>{
    let token = req.headers.authorization
    console.log(`token: ${verifyToken(token)}`)
    verifyToken(token)
    .then(user => {
        console.log(`user: ${user}`)
      if (verifyToken(token)){
          res.send(`hello there! it works... ${JSON.stringify(user)}`)
      } else {
          res.send('not authorised')
      }
    })
})


  app.get("/protectedJwt", requireAuth, (req, res)=>{
    res.send(`hello there! it works...`)
  })






app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in development mode.`);
});

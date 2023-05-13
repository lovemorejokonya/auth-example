const jwt = require('jsonwebtoken');
require('dotenv').config()

const admin = {
    name: 'Lovemore',
    email: 'lovemore@test.com'
}
const tokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.sign({ email: user.email }, process.env.JWT_SECRET);
}

const decodedToken = (token) => {
    let decoded = jwt.decode(token, process.env.JWT_SECRET)
   return decoded
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            console.log(`err with jwt verify: ${err.message}`)
            return
        }
       return getUserWithEmail(decoded.email)
        .then(user =>  {
            console.log(`user getuser: ${JSON.stringify(user)}`)
           return user
        })
        .catch(err => console.log(err))
      });
}

const getUserWithEmail = (email) => {
    return Promise.resolve(admin);
}

module.exports = { 
    tokenForUser, 
    decodedToken,
    verifyToken,
    getUserWithEmail 
}
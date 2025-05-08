
const jwt = require('jsonwebtoken')
const jwtMiddleware = (req, res, next) => {
    console.log("inside jwt middleware");
    const token = req.headers.authorization.split(' ')[1]
   // console.log(token);
    try {
        const jwtResponse = jwt.verify(token,'secretkey')
       // console.log(jwtResponse);
       req.payload = jwtResponse.userMail
        next()
    } catch (error) {
        
    }
    
}

module.exports = jwtMiddleware
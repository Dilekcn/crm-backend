const jwt = require("jsonwebtoken")
require("dotenv").config()

const isAdmin = (req,res,next) => {
  const token  = req.params.token || req.body.token || req.headers['x-access-token'] || req.headers.token

 jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, data)=> {
   if(err) return res.sendStatus(403).json({message:"You are not authorized"})
   
   if(data.role === "admin") {
     next()
   } else {
    res.sendStatus(403).json({message:"You are not authorized"})
   }
 })
}

module.exports = isAdmin
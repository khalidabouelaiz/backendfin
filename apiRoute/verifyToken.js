const jwt  = require('jsonwebtoken');
const secretKey = "azertyuio@%123456";


const verifyToken = (req,res,next)=>{
    const token = req.headers['Autorization'];
    console.log('token:', token);

    if(!token){
        res.status(403).send("token is required for authentication")
    }else{
        try{ 
           const decodedToken = jwt.verify(token, secretKey )
           req.decodedToken = decodedToken
        }catch {
            res.json({status : 'error', data: 'il ya une erreur'})
        }
    } return next();
};

module.exports = verifyToken;
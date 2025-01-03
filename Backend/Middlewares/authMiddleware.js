/* Este archivo contiene un middleware que maneja el chequeo de la autenticación */

const jwt = require("jsonwebtoken");

/*
    La función authCheck es un middleware que recibe un token y lo verifica con JWT.
    Devuelve el username decodificado.
*/
const authCheck = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader){res.status(403).send({auth:false, message: "No se proveyó un token"})};

    const token = authHeader.split(' ')[1];

    if(!token){res.status(403).send({auth:false, message: "Token malformado"})};

    //jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    jwt.verify(token, 'admin1234', (err, decoded) => {
        if(err){return res.status(500).send({auth:false, message:"Failed to authenticate token"})};

        req.userId = decoded.username;

        next();
    });
};

module.exports={authCheck};
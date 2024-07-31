/* Este archivo maneja las rutas para manejar los datos de la autenticación de logueo y registro */

const myExpress = require('express');
const myRouter = myExpress.Router();
const authController = require('../Controller/authController');
const authMiddleware = require('../Middlewares/authMiddleware');

myRouter.post("/register", authController.register);

myRouter.post("/login", authController.login);

myRouter.get("/protected", authMiddleware.authCheck, (req,res)=>{
    res.status(200).send(`Hello ${req.userId}`);
});

module.exports = myRouter;
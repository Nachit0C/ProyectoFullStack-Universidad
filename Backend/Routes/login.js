const myExpress = require('express');
const myRouter = myExpress.Router();
const loginController = require('../Controller/loginController');

myRouter.post("/", loginController.login);

module.exports = myRouter;
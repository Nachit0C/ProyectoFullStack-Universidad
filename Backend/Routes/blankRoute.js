const myExpress = require('express');
const myRouter = myExpress.Router();
const bienvenidaController = require('../Controller/bienvenidaController');

myRouter.get("/", bienvenidaController);

module.exports = myRouter;
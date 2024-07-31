/* Este archivo maneja la ruta en blanco del servidor */

const myExpress = require('express');
const myRouter = myExpress.Router();
const bienvenidaController = require('../Controller/bienvenidaController');

myRouter.get("/", bienvenidaController);

module.exports = myRouter;
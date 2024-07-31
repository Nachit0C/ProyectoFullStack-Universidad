/* Este archivo maneja las rutas para manejar los datos de la tabla carreras */

const myExpress = require('express');
const myRouter = myExpress.Router();
const carrerasController = require('../Controller/carrerasController');

myRouter.get("/", carrerasController.carreras);

module.exports = myRouter;
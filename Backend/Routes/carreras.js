const myExpress = require('express');
const myRouter = myExpress.Router();
const carrerasController = require('../Controller/carrerasController');

myRouter.get("/", carrerasController.carreras);

module.exports = myRouter;
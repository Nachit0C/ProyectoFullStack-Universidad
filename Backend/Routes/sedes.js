/* Este archivo maneja las rutas para manejar los datos de la tabla sedes */

const myExpress = require('express');
const myRouter = myExpress.Router();
const sedesController = require('../Controller/sedesController');

myRouter.get("/", sedesController.sedes);

module.exports = myRouter;
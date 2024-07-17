const myExpress = require('express');
const myRouter = myExpress.Router();
const sedesController = require('../Controller/sedesController');

myRouter.get("/", sedesController.sedes);

module.exports = myRouter;
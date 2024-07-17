const myExpress = require('express');
const myRouter = myExpress.Router();
const inscripcionesController = require('../Controller/inscripcionesController');

myRouter.get("/all", inscripcionesController.getInscripciones);

myRouter.get("/:id", inscripcionesController.getInscripcionesDePersona);

myRouter.post("/create/:id", inscripcionesController.createInscripcion);

myRouter.put("/update/:id", inscripcionesController.updateInscripcion);

myRouter.delete("/delete/:id", inscripcionesController.deleteInscripcion);

module.exports = myRouter;
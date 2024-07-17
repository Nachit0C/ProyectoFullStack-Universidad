const myExpress = require('express');
const myRouter = myExpress.Router();
const alumnoController = require('../Controller/alumnoController');

myRouter.get("/all", alumnoController.alumnos);

myRouter.get("/:id", alumnoController.alumno);

myRouter.post("/create/:id", alumnoController.createAlumno);

myRouter.put("/update/:id", alumnoController.updateAlumno);

myRouter.delete("/delete/:id", alumnoController.deleteAlumno);

module.exports = myRouter;
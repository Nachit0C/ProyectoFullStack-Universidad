const myExpress = require('express');
const myRouter = myExpress.Router();
const personaController = require('../Controller/personaController');

myRouter.get("/all", personaController.personas);

myRouter.get("/:id", personaController.getPersona);

myRouter.post("/create", personaController.createPersona);

myRouter.put("/update/:id", personaController.updatePersona);

myRouter.delete("/delete/:id", personaController.deletePersona);

module.exports = myRouter;
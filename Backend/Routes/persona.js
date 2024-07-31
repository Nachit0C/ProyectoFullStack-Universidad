/* Este archivo maneja las rutas para manejar los datos de la tabla personas */

const myExpress = require('express');
const myRouter = myExpress.Router();
const personaController = require('../Controller/personaController');
const authMiddleware = require('../Middlewares/authMiddleware');

myRouter.get("/all", authMiddleware.authCheck, personaController.personas);

myRouter.get("/:id", authMiddleware.authCheck, personaController.getPersona);

myRouter.post("/create", authMiddleware.authCheck, personaController.createPersona);

myRouter.put("/update/:id", authMiddleware.authCheck, personaController.updatePersona);

myRouter.delete("/delete/:id", authMiddleware.authCheck, personaController.deletePersona);

module.exports = myRouter;
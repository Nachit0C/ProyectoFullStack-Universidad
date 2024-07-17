const myExpress = require('express');
const blankRoute = require('./Routes/blankRoute');
const carreras = require('./Routes/carreras');
const sedes = require('./Routes/sedes');
const persona = require('./Routes/persona');
const alumno = require('./Routes/alumno');
const inscripciones = require('./Routes/inscripciones');

const PORT = process.env.PORT || 3000;

const myApp = myExpress();

myApp.use(myExpress.json());

myApp.use("/", blankRoute);

myApp.use("/carreras", carreras);

myApp.use("/sedes", sedes);

myApp.use("/persona", persona);

myApp.use("/alumno", alumno);

myApp.use('/inscripciones', inscripciones);

myApp.listen( PORT, () =>{
    console.log(`Server running at port: http://localhost:${PORT} .`);
});

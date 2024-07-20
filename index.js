const myExpress = require('express');
const cors = require('cors');
const blankRoute = require('./Backend/Routes/blankRoute');
const carreras = require('./Backend/Routes/carreras');
const sedes = require('./Backend/Routes/sedes');
const persona = require('./Backend/Routes/persona');
const alumno = require('./Backend/Routes/alumno');
const inscripciones = require('./Backend/Routes/inscripciones');
const authRoute = require("./Backend/Routes/authRoute");
const path = require('path');

const PORT = process.env.PORT || 3000;

const myApp = myExpress();

/*myApp.use(cors({
    origin: 'http://127.0.0.1:5500'
}));*/

myApp.use(cors());

myApp.use(myExpress.json());

myApp.use(myExpress.static(path.join(__dirname, 'Frontend')));

console.log('host:', process.env.HOST);
console.log(process.env.PRUEBA);
console.log(process.env.USER);
console.log(process.env.PASSWORD);
console.log(process.env.DATABASE);
console.log(process.env.SECRET_KEY);
console.log(process.env.APIURL);

myApp.use("/", blankRoute);

myApp.use("/carreras", carreras);

myApp.use("/sedes", sedes);

myApp.use("/persona", persona);

myApp.use("/alumno", alumno);

myApp.use('/inscripciones', inscripciones);

myApp.use("/auth", authRoute);

myApp.listen( PORT, () =>{
    //console.log(`Server running at port: http://localhost:${PORT} .`);
    console.log(`Server running.`);
});
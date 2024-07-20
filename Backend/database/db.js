const mysql = require('mysql2');
require('dotenv').config();
// Configurar con los datos de la base de datos
const coneccion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
});

coneccion.connect( (err) => {
    if(err){
        console.error("Error en la conección a la base de datos", err);
    }else{
        console.log("Conexión a base de datos realizada");
    }
});

module.exports = coneccion;

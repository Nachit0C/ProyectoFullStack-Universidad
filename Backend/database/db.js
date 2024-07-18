const mysql = require('mysql2');
require('dotenv').config();
// Configurar con los datos de la base de datos
const coneccion = mysql.createConnection({
    //host local:
    host: process.env.HOST,
    //host para alwaysdata.
    //host: 'mysql-nachociccone.alwaysdata.net',
    //user local:
    user: process.env.USER,
    //user para alwaysdata:
    //user: '367447_nachocicc',
    //password para alwaysdata.
    //password es la misma.
    password: process.env.PASSWORD,
    //port: 3306,
    //database local:
    database: process.env.DATABASE,
    //database para alwaysdata:
    //database: 'nachociccone_urioplata',
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

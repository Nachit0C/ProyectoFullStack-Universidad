const mysql = require('mysql2');
require('dotenv').config();
// Configurar con los datos de la base de datos
const coneccion = mysql.createConnection({
    /*host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,*/
    host:'mysql-urioplata.alwaysdata.net',
    user:'urioplata',
    password:'Nachito1234#',
    database:'urioplata_db',
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

/* Este archivo maneja las funciones relacionadas a las rutas de carreras */

const db = require('../database/db');

/*
    La función alumnos carreras la ruta /carreras
    Responde a un GET sin recibir información y devuelve todos los datos de la tabla carreras.
*/
const carreras = (req, res) => {
    const sql = `SELECT * FROM carreras;`;
    db.query(sql, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };
        
        res.status(201).json({ message: 'Éxito al obtener carreras', result });
    });
};

module.exports = {carreras};

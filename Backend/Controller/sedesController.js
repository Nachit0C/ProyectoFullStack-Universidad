/* Este archivo maneja las funciones relacionadas a las rutas de sedes */

const db = require('../database/db');

/*
    La función alumnos carreras la ruta /sedes
    Responde a un GET sin recibir información y devuelve todos los datos de la tabla sedes.
*/
const sedes = (req, res) => {
    const sql = `SELECT * FROM sedes;`;
    db.query(sql, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };
        
        res.status(201).json({ message: 'Éxito al obtener sedes', result });
    });
};

module.exports = {sedes};

/* Este archivo maneja las funciones relacionadas a las rutas de alumnos */

const db = require('../database/db');

/*
    La función alumnos maneja la ruta /alumno/all
    Responde a un GET sin recibir información y devuelve todos los datos de la tabla alumnos.
*/
const alumnos = (req, res) => {
    const sql = 'SELECT * FROM alumnos;';
    db.query(sql, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };
        
        if (result.length == 0) {
            return res.status(202).json({message:'No hay alumnos registrados todavía.'});
        } 
        else {
            res.status(201).json({ message: 'Éxito al obtener alumnos', result });
        }
    });
};

/*
    La función alumno maneja la ruta /alumno/id
    Responde a un GET obteniendo el id de la persona por url.
    Devuelve todos los datos de esa persona de la tabla alumnos.
*/
const alumno = (req, res) => {
    const persona_id = req.params.id; 
    //Chequea si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };

        if (result.length == 0) {
            return res.status(400).json({ error: 'No existe persona con ese id.'} );
        } 
        else {
            const sql2 = 'SELECT * FROM alumnos WHERE persona_id = ? ;';
            db.query(sql2, persona_id, (err, result) =>{
                if (err) {
                    return res.status(500).json({ error: 'Error en el servidor' });
                };
                
                if (result.length == 0) {
                    return res.status(201).json({message: 'La persona seleccionada no es un alumno.', esAlumno: false});
                } 
                else {
                    res.status(201).json({ message: 'Éxito al obtener alumno', esAlumno: true, result });
                }
            });
        }
    });
};

/*
    La función createAlumno maneja la ruta /alumno/create/id
    Responde a un POST, creando una nueva fila en la tabla alumnos.
    Recibe el id de la persona por url y los valores de la tabla por body.
*/
const createAlumno = (req, res) => {
    const persona_id = req.params.id;
    const datos = req.body;

    if(!validarDatos(datos)) res.status(400).json({ error: 'Error, datos enviados no válidos'});
    
    const {becado, fecha_ingreso} = datos;

    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };

        if (result.length == 0) {
            return res.status(400).json({ error:'No existe persona con ese id.'});
        } 
        else {
            //Chequeo si ya existe ese alumno asociado a la persona.
            const sql2 = `SELECT * FROM alumnos WHERE persona_id = ? ;`;
            
            db.query(sql2, persona_id, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error en el servidor' });
                };

                if (result.length > 0) {
                    return res.status(401).json({ error:'Ya existe un alumno asociado al id de esa persona'});
                } 
                else {
                    const sql3 = `INSERT INTO alumnos (persona_id, becado, fecha_ingreso) VALUES (?, ?, ?);`;
                    db.query(sql3, [persona_id, becado, fecha_ingreso], (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error en el servidor' });
                        };
                        res.status(201).json({ message: 'Éxito al crear alumno', result });
                    });
                }
            });
        }
    });
};

/*
    La función updateAlumno maneja la ruta /alumno/update/id
    Responde a un PUT, y actualiza una fila en la tabla alumnos.
    Recibe el id de la persona por url y los valores de la tabla por body.
*/
const updateAlumno = (req, res) => {
    const persona_id = req.params.id;
    const datos = req.body;
    
    if(!validarDatos(datos)) res.status(400).send('Error, datos enviados no válidos');
    
    const {becado, fecha_ingreso} = datos;

    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };

        if (result.length == 0) {
            return res.status(400).json({ error:'No existe persona con ese id.'});
        } 
        else {
            //Chequeo si existe ese alumno asociado a la persona.
            const sql2 = `SELECT alumno_id FROM alumnos WHERE persona_id = ? ;`;
            
            db.query(sql2, persona_id, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error en el servidor' });
                };

                if (result.length == 0) {
                    return res.status(401).json({ error:'La persona seleccionada no es un alumno.'});
                } 
                else {
                    const alumno_id = result[0].alumno_id;
                    const sql3 = "UPDATE alumnos SET persona_id = ?, becado = ?, fecha_ingreso = ? WHERE (alumno_id = ? )";
                    db.query(sql3,[persona_id, becado, fecha_ingreso, alumno_id] ,(err, result) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error en el servidor' });
                        };
                        res.status(201).json({ message: 'Éxito al actualizar alumno', result });       
                    });
                }
            });
        }
    });
};

/*
    La función deleteAlumno maneja la ruta /alumno/delete/id
    Responde a un DELETE, y elimina una fila en la tabla alumnos.
    Recibe el id de la persona por url.
*/
const deleteAlumno = (req, res) =>{
    const persona_id = req.params.id;
    
    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };

        if (result.length == 0) {
            return res.status(400).json({ error:'No existe persona con ese id.'});
        } 
        else {
            //Chequeo si existe ese alumno asociado a la persona.
            const sql2 = `SELECT alumno_id FROM alumnos WHERE persona_id = ? ;`
            db.query(sql2, persona_id, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error en el servidor' });
                };
        
                if (result.length == 0) {
                    return res.status(401).json({ error:'La persona seleccionada no es un alumno.'});
                } 
                else {
                    const alumno_id = result[0].alumno_id;
                    const sql3 = `DELETE FROM inscripciones WHERE (alumno_id = ?) ;
                    DELETE FROM alumnos WHERE (alumno_id = ?);`
                    db.query(sql3, [alumno_id,alumno_id], (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error en el servidor' });
                        };
                        res.status(201).json({ message: 'Éxito al eliminar alumno', result });
                    });
                }
            });
        }
    });
};

/*
    La función validarDatos valida los datos becado y fecha_ingreso.
*/
const validarDatos = (data) => {
    return (data.becado != null && data.fecha_ingreso != null);
};

module.exports = {alumnos, alumno, createAlumno, updateAlumno, deleteAlumno};
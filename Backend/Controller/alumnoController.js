const db = require('../database/db');

const alumnos = (req, res) => {
    const sql = 'SELECT * FROM alumnos;';
    db.query(sql, (err, result) =>{
        if(err) throw err;
        
        if (result.length == 0) {
            return res.send('No hay alumnos registrados todavía.');
        } else {
            res.send(result);
        }
    });
};

const alumno = (req, res) => {
    const persona_id = req.params.id; 
    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if(err) throw err;

        if (result.length == 0) {
            return res.send('No existe persona con ese id.');
        } else {
            const sql2 = 'SELECT * FROM alumnos WHERE persona_id = ? ;';
            db.query(sql2, persona_id, (err, result) =>{
                if(err) throw err;
                
                if (result.length == 0) {
                    return res.send('La persona seleccionada no es un alumno.');
                } else {
                    res.send(result);
                }
            });
        }
    });
};

const createAlumno = (req, res) => {
    const persona_id = req.params.id;
    const datos = req.body;

    if(!validarDatos(datos)) res.status(400).send('Error, datos enviados no válidos');
    
    const {becado, fecha_ingreso} = datos;

    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if(err) throw err;

        if (result.length == 0) {
            return res.send('No existe persona con ese id.');
        } else {
            //Chequeo si ya existe ese alumno asociado a la persona.
            const sql2 = `SELECT * FROM alumnos WHERE persona_id = ? ;`;
            
            db.query(sql2, persona_id, (err, result) => {
                if (err) throw err;

                if (result.length > 0) {
                    return res.send('Ya existe un alumno asociado al id de esa persona');
                } else {
                    const sql3 = `INSERT INTO alumnos (persona_id, becado, fecha_ingreso) VALUES (?, ?, ?);`;
                    db.query(sql3, [persona_id, becado, fecha_ingreso], (err, result) => {
                        if (err) throw err;
                        res.send(result);
                    });
                }
            });
        }
    });
};

const updateAlumno = (req, res) => {
    const persona_id = req.params.id;
    const datos = req.body;
    
    if(!validarDatos(datos)) res.status(400).send('Error, datos enviados no válidos');
    
    const {becado, fecha_ingreso} = datos;

    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if(err) throw err;

        if (result.length == 0) {
            return res.send('No existe persona con ese id.');
        } else {
            //Chequeo si existe ese alumno asociado a la persona.
            const sql2 = `SELECT alumno_id FROM alumnos WHERE persona_id = ? ;`;
            
            db.query(sql2, persona_id, (err, result) => {
                if (err) throw err;

                if (result.length == 0) {
                    return res.send('La persona seleccionada no es un alumno.');
                } else {
                    const alumno_id = result[0].alumno_id;
                    const sql3 = "UPDATE alumnos SET persona_id = ?, becado = ?, fecha_ingreso = ? WHERE (alumno_id = ? )";
                    db.query(sql3,[persona_id, becado, fecha_ingreso, alumno_id] ,(err, result) => {
                        if (err) throw err;
                        res.send(result);        
                    });
                }
            });
        }
    });
};

const deleteAlumno = (req, res) =>{
    const persona_id = req.params.id;
    
    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if(err) throw err;

        if (result.length == 0) {
            return res.send('No existe persona con ese id.');
        } else {
            //Chequeo si existe ese alumno asociado a la persona.
            const sql2 = `SELECT alumno_id FROM alumnos WHERE persona_id = ? ;`
            db.query(sql2, persona_id, (err, result) => {
                if (err) throw err;
        
                if (result.length == 0) {
                    return res.send('La persona seleccionada no es un alumno.');
                } else {
                    const alumno_id = result[0].alumno_id;
                    const sql3 = `DELETE FROM inscripciones WHERE (alumno_id = ?) ;
                    DELETE FROM alumnos WHERE (alumno_id = ?);`
                    db.query(sql3, [alumno_id,alumno_id], (err, result) => {
                        if (err) throw err;
                        res.send(result);
                    });
                }
            });
        }
    });
};

const validarDatos = (data) => {
    return (data.becado != null && data.fecha_ingreso != null);
};

module.exports = {alumnos, alumno, createAlumno, updateAlumno, deleteAlumno};

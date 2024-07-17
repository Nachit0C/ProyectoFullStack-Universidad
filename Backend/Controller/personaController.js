const db = require('../database/db');

const personas = (req, res) => {
    const sql = `SELECT * FROM personas;`;
    db.query(sql, (err, result) =>{
        if(err) throw err;
        
        if (result.length == 0) {
            return res.send('No hay personas registradas todavía.');
        } else {
            res.send(result);
        }
    });
};

const getPersona = (req, res) => {
    const persona_id = req.params.id;
    const sql = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql, persona_id, (err, result) =>{
        if(err) throw err;

        if (result.length == 0) {
            return res.send('No existe persona con ese id.');
        } else {
            res.send(result);
        }
    });
};

const createPersona = (req, res) => {
    const dataRequest = req.body;
        if(validarDatos(dataRequest)){
        const {nombre, apellido, dni, fecha_nacimiento, email, telefono, direccion}= dataRequest ;
        //Verifico si ya existe una persona con el mismo dni o email
        const sql1 = `SELECT * FROM personas WHERE (dni = ?) OR (email = ?);`;
        db.query(sql1,[dni,email], (err,result) => {
            if (err) throw err;

            if (result.length > 0) {
                return res.send('Ya existe una persona con ese dni o email.');
            } else {
                const sql = `INSERT INTO personas (nombre, apellido, dni, fecha_nacimiento, email, telefono, direccion) 
                    VALUES (?, ?, ?, ?, ?, ?, ?);`;
                db.query(sql,[nombre, apellido, dni, fecha_nacimiento, email, telefono, direccion] ,(err, result) => {
                    if (err) throw err;
                    res.send(result);        
                });
            }
        });

    }else{
        res.status(400).send('Error, datos enviados no válidos');
    }
}

const updatePersona = (req, res) => {
    const persona_id = req.params.id;
    const dataRequest = req.body;
    
    if(validarDatos(dataRequest)){
        const {nombre, apellido, dni, fecha_nacimiento, email, telefono, direccion}= dataRequest ;
        //Verifico que exista persona con el id enviado
        const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
        db.query(sql1, persona_id, (err, result) =>{
            if(err) throw err;

            if (result.length == 0) {
                return res.send('No existe persona con ese id.');
            } else {
                //Verifico si ya existe una persona con el mismo dni o email
                const sql2 = `SELECT * FROM personas WHERE (dni = ? OR email = ?) AND (persona_id != ?);`;
                db.query(sql2,[dni,email, persona_id], (err,result) => {
                    if (err) throw err;

                    if (result.length > 0) {
                        return res.send('Ya existe una persona con ese dni o email.');
                    } else {
                        const sql3 = `UPDATE personas SET nombre = ?, apellido = ?, dni = ?, fecha_nacimiento = ?, email = ?, telefono    = ?, direccion = ? WHERE (persona_id = ? );`;

                        db.query(sql3,[nombre, apellido, dni, fecha_nacimiento, email, telefono, direccion, persona_id] ,(err, result) => {
                            if (err) throw err;
                            res.send(result);        
                        });
                    }
                });
            }
        });
    }else{
        res.status(400).send('Error, datos enviados no válidos');
    }
};

const deletePersona = (req, res) => {
    const persona_id = req.params.id;

    //Verifico que exista persona con el id enviado
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if(err) throw err;

        if (result.length == 0) {
            return res.status(400).send('No existe persona con ese id.');
        } else {
            const sql2 = `SELECT alumno_id FROM alumnos where persona_id= ? ;`;
            db.query(sql2, persona_id, (err, result) => {
                if (err) throw err;

                if (result.length == 0) {
                    //Si esa persona no es un alumno, elimino solo en la tabla personas.
                    const sql3 = `DELETE FROM personas WHERE (persona_id = ?);`;
                    db.query(sql3, [persona_id], (err, result) => {
                        if (err) throw err;
                        res.send(result);
                    });
                } else {
                    //Si esa persona es un alumno, elimino primero inscripciones despues la tabla alumno y despues la tabla personas.
                    const alumno_id = result[0].alumno_id;
                    const sql3 = `DELETE FROM inscripciones WHERE (alumno_id = ?);
                    DELETE FROM alumnos WHERE (alumno_id = ?);
                    DELETE FROM personas WHERE (persona_id = ?);`;
    
                    db.query(sql3, [alumno_id,alumno_id,persona_id], (err, result) => {
                        if (err) throw err;
                        res.send(result);
                    });
                }
            });
        }
    });
}

const validarDatos = (data) => {
    return (data.nombre != null && data.apellido != null && data.dni != null && data.email != null);
};

module.exports = {personas, getPersona, createPersona, updatePersona, deletePersona};

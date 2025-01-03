/* Este archivo maneja las funciones relacionadas a las rutas de personas */

const db = require('../database/db');

/*
    La función personas maneja la ruta /persona/all
    Responde a un GET sin recibir información y devuelve todos los datos de la tabla personas.
*/
const personas = (req, res) => {
    const sql = `SELECT * FROM personas;`;
    db.query(sql, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };
        
        if (result.length == 0) {
            return res.status(400).json({ error: 'No hay personas registradas todavía.' });
        } 
        else {
            res.status(201).json({ message: 'Éxito al obtener las personas', result });
        }
    });
};

/*
    La función getPersona maneja la ruta /persona/id
    Responde a un GET obteniendo el id de la persona por url.
    Devuelve todos los datos de esa persona de la tabla personas.
*/
const getPersona = (req, res) => {
    const persona_id = req.params.id;
    const sql = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql, persona_id, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };

        if (result.length == 0) {
            return res.status(400).json('No existe persona con ese id.');
        } 
        else {
            res.status(201).json({ message: 'Éxito al obtener la persona', result });
        }
    });
};

/*
    La función createPersona maneja la ruta /persona/create
    Responde a un POST, creando una nueva fila en la tabla personas.
    Recibe los valores de la tabla por body.
*/
const createPersona = (req, res) => {
    const dataRequest = req.body;
        if(validarDatos(dataRequest)){
        const {nombre, apellido, dni, fecha_nacimiento, email, telefono, direccion}= dataRequest ;
        //Verifico si ya existe una persona con el mismo dni o email
        const sql1 = `SELECT * FROM personas WHERE (dni = ?) OR (email = ?);`;
        db.query(sql1,[dni,email], (err,result) => {
            if (err) {
                return res.status(500).json({ error: 'Error en el servidor' });
            };

            if (result.length > 0) {
                return res.status(401).json({ error: 'Ya existe una persona con ese dni o email.' });
            } 
            else {
                const sql = `INSERT INTO personas (nombre, apellido, dni, fecha_nacimiento, email, telefono, direccion) 
                    VALUES (?, ?, ?, ?, ?, ?, ?);`;
                db.query(sql,[nombre, apellido, dni, fecha_nacimiento, email, telefono, direccion] ,(err, result) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error en el servidor' });
                    };
                    res.status(201).json({ message: 'Persona creada con éxito', result });
                });
            }
        });

    }
    else{
        res.status(400).send('Error, datos enviados no válidos');
    }
}

/*
    La función updatePersona maneja la ruta /persona/update/id
    Responde a un PUT, y actualiza una fila en la tabla personas.
    Recibe el id de la persona por url y los valores de la tabla por body.
*/
const updatePersona = (req, res) => {
    const persona_id = req.params.id;
    const dataRequest = req.body;
    
    if(validarDatos(dataRequest)){
        const {nombre, apellido, dni, fecha_nacimiento, email, telefono, direccion}= dataRequest ;
        //Verifico que exista persona con el id enviado
        const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
        db.query(sql1, persona_id, (err, result) =>{
            if (err) {
                return res.status(500).json({ error: 'Error en el servidor' });
            };

            if (result.length == 0) {
                return res.status(400).json('No existe persona con ese id.');
            } 
            else {
                //Verifico si ya existe una persona con el mismo dni o email
                const sql2 = `SELECT * FROM personas WHERE (dni = ? OR email = ?) AND (persona_id != ?);`;
                db.query(sql2,[dni,email, persona_id], (err,result) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error en el servidor' });
                    };

                    if (result.length > 0) {
                        return res.status(401).json({ error: 'Ya existe una persona con ese dni o email.' });
                    } 
                    else {
                        const sql3 = `UPDATE personas SET nombre = ?, apellido = ?, dni = ?, fecha_nacimiento = ?, email = ?, telefono    = ?, direccion = ? WHERE (persona_id = ? );`;

                        db.query(sql3,[nombre, apellido, dni, fecha_nacimiento, email, telefono, direccion, persona_id] ,(err, result) => {
                            if (err) {
                                return res.status(500).json({ error: 'Error en el servidor' });
                            };
                            res.status(201).json({ message: 'Persona actualizada con éxito', result });     
                        });
                    }
                });
            }
        });
    }
    else{
        res.status(400).send('Error, datos enviados no válidos');
    }
};

/*
    La función deletePersona maneja la ruta /persona/delete/id
    Responde a un DELETE, y elimina una fila en la tabla personas.
    Recibe el id de la persona por url.
*/
const deletePersona = (req, res) => {
    const persona_id = req.params.id;

    //Verifico que exista persona con el id enviado
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };

        if (result.length == 0) {
            return res.status(400).send('No existe persona con ese id.');
        } 
        else {
            const sql2 = `SELECT alumno_id FROM alumnos where persona_id= ? ;`;
            db.query(sql2, persona_id, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error en el servidor' });
                };

                if (result.length == 0) {
                    //Si esa persona no es un alumno, elimino solo en la tabla personas.
                    const sql3 = `DELETE FROM personas WHERE (persona_id = ?);`;
                    db.query(sql3, [persona_id], (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error en el servidor' });
                        };
                        res.status(201).json({ message: 'Persona eliminada con éxito', result }); 
                    });
                } 
                else {
                    //Si esa persona es un alumno, elimino primero inscripciones despues la tabla alumno y despues la tabla personas.
                    const alumno_id = result[0].alumno_id;
                    const sql3 = `DELETE FROM inscripciones WHERE (alumno_id = ?);
                    DELETE FROM alumnos WHERE (alumno_id = ?);
                    DELETE FROM personas WHERE (persona_id = ?);`;
    
                    db.query(sql3, [alumno_id,alumno_id,persona_id], (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error en el servidor' });
                        };
                        res.status(201).json({ message: 'Persona eliminada con éxito', result }); 
                    });
                }
            });
        }
    });
}

/*
    La función validarDatos valida los datos de las persona recibida.
*/
const validarDatos = (data) => {
    return (data.nombre != null && data.apellido != null && data.dni != null && data.email != null);
};

module.exports = {personas, getPersona, createPersona, updatePersona, deletePersona};
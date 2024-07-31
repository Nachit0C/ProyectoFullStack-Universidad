/* Este archivo maneja las funciones relacionadas a las rutas de inscripciones */

const db = require('../database/db');

/*
    La función getInscripciones maneja la ruta /inscripciones/all
    Responde a un GET sin recibir información y devuelve todos los datos de la tabla inscripciones.
*/
const getInscripciones = (req, res) => {
    const sql = 'SELECT * FROM inscripciones;';
    db.query(sql, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };

        if (result.length == 0) {
            res.status(202).json({message:'No hay inscripciones realizadas todavía.'});
        } 
        else {
            res.status(201).json({ message: 'Éxito al obtener inscripciones', result });
        }
    });
};

/*
    La función getInscripcionesDePersona maneja la ruta /inscripciones/id
    Responde a un GET obteniendo el id de la persona por url.
    Devuelve todos los datos de esa persona de la tabla inscripciones.
*/
const getInscripcionesDePersona = (req, res) => {
    const persona_id = req.params.id;

    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };

        if (result.length == 0) {
            return res.status(400).json({ error: 'No existe persona con ese id.'} );
        } 
        else {
            //Chequeo si esa persona es un alumno:
            const sql2 = 'SELECT alumno_id FROM alumnos WHERE persona_id = ? ;';
            db.query(sql2, persona_id, (err, result) =>{
                if (err) {
                    return res.status(500).json({ error: 'Error en el servidor' });
                };
        
                if (result.length == 0) {
                    return res.status(400).json({ error:'No existe un alumno asociado a esa persona'});
                } 
                else {
                    const alumno_id = result[0].alumno_id;
                    const sql3 = 'SELECT * FROM inscripciones WHERE alumno_id = ? ;';
                    db.query(sql3, alumno_id, (err, result) =>{
                        if (err) {
                            return res.status(500).json({ error: 'Error en el servidor' });
                        };
        
                        if (result.length == 0) {
                            return res.status(400).json({ error:'No existen un inscripciones asociadas a ese alumno'});
                        } 
                        else {
                            res.status(201).json({ message: 'Éxito al obtener inscripciones', result });
                        }
                    });
                }
            });
        }
    });
};

/*
    La función createInscripcion maneja la ruta /inscripciones/create/id
    Responde a un POST, creando una nueva fila en la tabla inscripciones.
    Recibe el id de la persona por url y los valores de la tabla por body.
*/
const createInscripcion = (req, res) => {
    const persona_id = req.params.id;
    const dataRequest = req.body;

    const {carrera_id, fecha_inscripcion} = dataRequest;
    if(!validarCarrera(carrera_id)) res.status(400).json({ error: 'Error, datos enviados no válidos'});
    const sede_id = sede(carrera_id);

    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };

        if (result.length == 0) {
            return res.status(400).json({ error: 'No existe persona con ese id.'} );
        } 
        else {
            //Chequeo si esa persona es un alumno:
            const sql2 = 'SELECT alumno_id FROM alumnos WHERE persona_id = ? ;';
            db.query(sql2, persona_id, (err, result) =>{
                if (err) {
                    return res.status(500).json({ error: 'Error en el servidor' });
                };
        
                if (result.length == 0) {
                    return res.status(400).json({ error:'No existe un alumno asociado a esa persona'});
                } 
                else {
                    const alumno_id = result[0].alumno_id;
                    //Chequeo si el alumno ya está anotado a esa carrera:
                    const sql3 = `SELECT * FROM inscripciones WHERE (alumno_id = ?) AND (carrera_id = ?);`;
                    db.query(sql3,[alumno_id, carrera_id] ,(err, result) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error en el servidor' });
                        };
                        if(result.length > 0){
                            return res.status(201).json({ message:'El alumno ya está inscripto a esa carrera.'});
                        }
                        else{
                            const sql4 = `INSERT INTO inscripciones (alumno_id, carrera_id, sede_id, fecha_inscripcion) VALUES (?, ?, ?, ?);`;
                            db.query(sql4,[alumno_id, carrera_id, sede_id, fecha_inscripcion] ,(err, result) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Error en el servidor' });
                                };
                                res.status(200).json({ message: 'Éxito al crear inscripción', result });      
                            });
                        } 
                    });
                }
            });
        }
    });
}

/*
    La función deleteInscripcion maneja la ruta /inscripciones/delete/id
    Responde a un DELETE, y elimina una fila en la tabla inscripciones.
    Recibe el id de la persona por url y la carrera la cual se quiere eliminar por body.
*/
const deleteInscripcion = (req, res) => {
    const persona_id = req.params.id;
    const dataRequest = req.body;

    const {carrera_id} = dataRequest;
    if(!validarCarrera(carrera_id)) res.status(400).json({ error: 'Error, datos enviados no válidos'});

    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };

        if (result.length == 0) {
            return res.status(400).json({ error: 'No existe persona con ese id.'} );
        } 
        else {
            //Chequeo si esa persona es un alumno:
            const sql2 = 'SELECT alumno_id FROM alumnos WHERE persona_id = ? ;';
            db.query(sql2, persona_id, (err, result) =>{
                if (err) {
                    return res.status(500).json({ error: 'Error en el servidor' });
                };
        
                if (result.length == 0) {
                    return res.status(400).json({ error:'No existe un alumno asociado a esa persona'});
                } 
                else {
                    //Chequeo si el alumno está inscripto a la carrera.
                    const alumno_id = result[0].alumno_id;
                    const sql3 = `SELECT * FROM inscripciones WHERE (alumno_id = ?) AND (carrera_id = ?);`;
                    db.query(sql3, [alumno_id,carrera_id], (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error en el servidor' });
                        };

                        if (result.length == 0) {
                            return res.status(201).json({ message:'El alumno no está inscripo a esa carrera.'});
                        } 
                        else {
                            const sql4 = `DELETE FROM inscripciones WHERE (alumno_id = ?) AND (carrera_id = ?) ;`;
                            db.query(sql4, [alumno_id,carrera_id], (err, result) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Error en el servidor' });
                                };
                                res.status(201).json({ message: 'Éxito al eliminar inscripción', result }); 
                            });
                        }
                    });
                }
            });
        }
    });
}

/*
    La función updateInscripcion maneja la ruta /inscripciones/update/id
    Responde a un PUT, y actualiza una fila en la tabla inscripciones.
    Recibe el id de la persona por url y los valores de la tabla por body.
*/
const updateInscripcion = (req, res) => {
    const persona_id = req.params.id;
    const dataRequest = req.body;

    const {old_carrera_id, new_carrera_id, fecha_inscripcion} = dataRequest;
    if(!validarCarrera(old_carrera_id) || !validarCarrera(new_carrera_id)) res.status(400).json({ error: 'Error, datos enviados no válidos'});
    const sede_id = sede(new_carrera_id);

    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };

        if (result.length == 0) {
            return res.status(400).json({ error: 'No existe persona con ese id.'} );
        } 
        else {
            //Chequeo si esa persona es un alumno:
            const sql2 = 'SELECT alumno_id FROM alumnos WHERE persona_id = ? ;';
            db.query(sql2, persona_id, (err, result) =>{
                if (err) {
                    return res.status(500).json({ error: 'Error en el servidor' });
                };
        
                if (result.length == 0) {
                    return res.status(400).json({ error:'No existe un alumno asociado a esa persona'});
                } 
                else {
                    //Chequeo si el alumno está inscripto en old_carrera_id y si ya está inscripto en new_carrera_id.
                    const alumno_id = result[0].alumno_id;
                    const sql3 = `SELECT * FROM inscripciones WHERE alumno_id = ? AND carrera_id = ? AND NOT EXISTS (SELECT 1 FROM inscripciones WHERE alumno_id = ? AND carrera_id = ?);`;
                    db.query(sql3, [alumno_id,old_carrera_id,alumno_id,new_carrera_id], (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error en el servidor' });
                        };
                        
                        if (result.length == 0) {
                            return res.status(201).json({ message:'El alumno ya está inscripto en la carrera a la cual quiere actualizar.'});
                        } 
                        else {
                            const sql5 = "UPDATE inscripciones SET carrera_id = ?, sede_id = ? ,fecha_inscripcion = ? WHERE (alumno_id = ? AND carrera_id = ?)";
                            db.query(sql5,[new_carrera_id, sede_id, fecha_inscripcion, alumno_id, old_carrera_id] ,(err, result) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Error en el servidor' });
                                };
                                res.status(200).json({ message: 'Éxito al actualizar inscripción', result });        
                            });
                        }
                    });
                }
            });

        }
    });
};

/*
    La función validarCarrera valida los datos de la carrera recibida.
*/
const validarCarrera = (data) => {
    const num = Number(data);
    return (num > 0 && num <9) ;
};

/*
    La función sede toma el id de la carrera recibida y devuelve la sede correspondiente.
*/
const sede = (carrera) => {
    switch(carrera){
        case "1":
        case "2":
        case "3":
            return "1";
        case "4":
        case "5":
            return "2";
        case "6":
            return "3";
        case "7":
        case "8":
            return "4";
    }
}

module.exports = {getInscripciones, getInscripcionesDePersona, createInscripcion, deleteInscripcion, updateInscripcion};

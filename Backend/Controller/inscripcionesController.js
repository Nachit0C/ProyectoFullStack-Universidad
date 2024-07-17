const db = require('../database/db');

const getInscripciones = (req, res) => {
    const sql = 'SELECT * FROM inscripciones;';
    db.query(sql, (err, result) =>{
        if(err) throw err;

        if (result.length == 0) {
            return res.send('No hay inscripciones realizadas todavía.');
        } else {
            res.send(result);
        }
    });
};

const getInscripcionesDePersona = (req, res) => {
    const persona_id = req.params.id;

    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if(err) throw err;

        if (result.length == 0) {
            return res.send('No existe persona con ese id.');
        } else {
            //Chequeo si esa persona es un alumno:
            const sql2 = 'SELECT alumno_id FROM alumnos WHERE persona_id = ? ;';
            db.query(sql2, persona_id, (err, result) =>{
                if(err) throw err;
        
                if (result.length == 0) {
                    return res.send('No existe un alumno asociado a esa persona');
                } else {
                    const alumno_id = result[0].alumno_id;
                    const sql3 = 'SELECT * FROM inscripciones WHERE alumno_id = ? ;';
                    db.query(sql3, alumno_id, (err, result) =>{
                        if(err) throw err;
        
                        if (result.length == 0) {
                            return res.send('No existen un inscripciones asociadas a ese alumno');
                        } else {
                            res.send(result);
                        }
                    });
                }
            });
        }
    });
};

const createInscripcion = (req, res) => {
    const persona_id = req.params.id;
    const dataRequest = req.body;

    const {carrera_id, fecha_inscripcion} = dataRequest;
    if(!validarCarrera(carrera_id)) res.send('Error, datos enviados no válidos');
    const sede_id = sede(carrera_id);

    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if(err) throw err;

        if (result.length == 0) {
            return res.send('No existe persona con ese id.');
        } else {
            //Chequeo si esa persona es un alumno:
            const sql2 = 'SELECT alumno_id FROM alumnos WHERE persona_id = ? ;';
            db.query(sql2, persona_id, (err, result) =>{
                if(err) throw err;
        
                if (result.length == 0) {
                    return res.send('No existe un alumno asociado a esa persona');
                } else {
                    const alumno_id = result[0].alumno_id;
                    //Chequeo si el alumno ya está anotado a esa carrera:
                    const sql3 = `SELECT * FROM inscripciones WHERE (alumno_id = ?) AND (carrera_id = ?);`;
                    db.query(sql3,[alumno_id, carrera_id] ,(err, result) => {
                        if (err) throw err;
                        if(result.length > 0){
                            return res.send('El alumno ya está inscripto a esa carrera.');
                        }else{
                            const sql4 = `INSERT INTO inscripciones (alumno_id, carrera_id, sede_id, fecha_inscripcion) VALUES (?, ?, ?, ?);`;
                            db.query(sql4,[alumno_id, carrera_id, sede_id, fecha_inscripcion] ,(err, result) => {
                                if (err) throw err;
                                res.send(result);        
                            });
                        } 
                    });
                }
            });
        }
    });
}

const deleteInscripcion = (req, res) => {
    const persona_id = req.params.id;
    const dataRequest = req.body;

    const {carrera_id} = dataRequest;
    if(!validarCarrera(carrera_id)) res.send('Error, datos enviados no válidos');

    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if(err) throw err;

        if (result.length == 0) {
            return res.send('No existe persona con ese id.');
        } else {
            //Chequeo si esa persona es un alumno:
            const sql2 = 'SELECT alumno_id FROM alumnos WHERE persona_id = ? ;';
            db.query(sql2, persona_id, (err, result) =>{
                if(err) throw err;
        
                if (result.length == 0) {
                    return res.send('No existe un alumno asociado a esa persona');
                } else {
                    //Chequeo si el alumno está inscripto a la carrera.
                    const alumno_id = result[0].alumno_id;
                    const sql3 = `SELECT * FROM inscripciones WHERE (alumno_id = ?) AND (carrera_id = ?);`;
                    db.query(sql3, [alumno_id,carrera_id], (err, result) => {
                        if (err) throw err;

                        if (result.length == 0) {
                            return res.send('El alumno no está inscripo a esa carrera.');
                        } else {
                            const sql4 = `DELETE FROM inscripciones WHERE (alumno_id = ?) AND (carrera_id = ?) ;`;
                            db.query(sql4, [alumno_id,carrera_id], (err, result) => {
                                if (err) throw err;
                                res.send(result);
                            });
                        }
                    });
                }
            });
        }
    });
}

const updateInscripcion = (req, res) => {
    const persona_id = req.params.id;
    const dataRequest = req.body;

    const {old_carrera_id, new_carrera_id, fecha_inscripcion} = dataRequest;
    if(!validarCarrera(old_carrera_id) || !validarCarrera(new_carrera_id)) res.send('Error, datos enviados no válidos');
    const sede_id = sede(new_carrera_id);

    //Chequeo si hay una persona con ese id:
    const sql1 = `SELECT * FROM personas WHERE persona_id = ? ;`;
    db.query(sql1, persona_id, (err, result) =>{
        if(err) throw err;

        if (result.length == 0) {
            return res.send('No existe persona con ese id.');
        } else {
            //Chequeo si esa persona es un alumno:
            const sql2 = 'SELECT alumno_id FROM alumnos WHERE persona_id = ? ;';
            db.query(sql2, persona_id, (err, result) =>{
                if(err) throw err;
        
                if (result.length == 0) {
                    return res.send('No existe un alumno asociado a esa persona');
                } else {
                    //Chequeo si el alumno está inscripto en old_carrera_id y si ya está inscripto en new_carrera_id.
                    const alumno_id = result[0].alumno_id;
                    const sql3 = `SELECT * FROM inscripciones WHERE alumno_id = ? AND carrera_id = ? AND NOT EXISTS (SELECT 1 FROM inscripciones WHERE alumno_id = ? AND carrera_id = ?);`;
                    db.query(sql3, [alumno_id,old_carrera_id,alumno_id,new_carrera_id], (err, result) => {
                        if (err) throw err;
                        
                        if (result.length == 0) {
                            return res.send('El alumno no está inscripto en la carrera que desea modificar o ya está inscripto en la carrera a la cual quiere actualizar.');
                        } else {
                            const sql5 = "UPDATE inscripciones SET carrera_id = ?, sede_id = ? ,fecha_inscripcion = ? WHERE (alumno_id = ? AND carrera_id = ?)";
                            db.query(sql5,[new_carrera_id, sede_id, fecha_inscripcion, alumno_id, old_carrera_id] ,(err, result) => {
                                if (err) throw err;
                                res.send(result);        
                            });
                        }
                    });
                }
            });

        }
    });
};

const validarCarrera = (data) => {
    const num = Number(data);
    return (num > 0 && num <9) ;
};

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

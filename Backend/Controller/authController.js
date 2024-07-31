/* Este archivo maneja las funciones relacionadas a las rutas de autenticación de logueo y registro */

const db = require('../database/db');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/*
    La función register maneja la ruta /auth/register
    Responde a un POST, utilizando bcrypt y jwt para generar credenciales de un registro encriptado.
    Devuelve el token generado para autenticar el login con esas credenciales.
*/
const register = (req,res) => {
    const{username,password} = req.body;
    const hashedPass = bcrypt.hashSync(password, 8);

    const sql = `INSERT INTO adminusers (username, password) VALUES (?, ?);`;

    db.query(sql, [username, hashedPass], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };
        //res.status(201).json({ message: 'adminUser creado con éxito', result });
        //const token = jwt.sign({username: username}, process.env.SECRET_KEY, {expiresIn: '1h'});
        const token = jwt.sign({username: username}, 'admin1234', {expiresIn: '1h'});
        
        res.status(201).send({auth: true, token});
    });
};

/*
    La función register maneja la ruta /auth/login
    Responde a un POST, utilizando bcrypt y jwt para autenticar credenciales de un registro encriptado.
*/
const login = (req,res) => {
    const{username,password} = req.body;

    const sql = `SELECT password FROM adminusers WHERE (username) = (?);`;

    db.query(sql, [username], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        };
        if (result.length === 0) {
            return res.status(401).json({ auth: false, message: 'Usuario no encontrado' });
        };
        const hashedPass = result[0].password;
        //res.status(201).json({ message: 'adminUser creado con éxito', result });
        const isPasswordValid = bcrypt.compareSync(password, hashedPass);
    
        if(!isPasswordValid){
            return res.status(401).send({auth: false, token: null, message:'Contraseña incorrecta'})
        };
    
        //const token = jwt.sign({username: username}, process.env.SECRET_KEY, {expiresIn: '1h'});
        const token = jwt.sign({username: username}, 'admin1234', {expiresIn: '1h'});
    
        res.status(200).send({auth:true, token});
    });
}

module.exports={register, login};
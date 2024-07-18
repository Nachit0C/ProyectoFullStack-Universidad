const db = require('../database/db');

const login = (req, res) => {
    const { username, password } = req.body;
    //const user = users.find(u => u.username === username && u.password === password);
    const userAdmin = {
        username: "admin",
        password: "1234"
    };

    if (username === userAdmin.username && password === userAdmin.password) {
        res.json({message:'true'});
    } else {
        res.status(401).json({error:'Credenciales incorrectas'});
    }
}

module.exports = {login};
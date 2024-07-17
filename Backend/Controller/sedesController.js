const db = require('../database/db');

const sedes = (req, res) => {
    const sql = `SELECT * FROM sedes;`;
    db.query(sql, (err, result) =>{
        if(err) throw err;
        
        res.send(result);
    });
};

module.exports = {sedes};

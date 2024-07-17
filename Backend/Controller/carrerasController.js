const db = require('../database/db');

const carreras = (req, res) => {
    const sql = `SELECT * FROM carreras;`;
    db.query(sql, (err, result) =>{
        if(err) throw err;
        
        res.send(result);
    });
};

module.exports = {carreras};

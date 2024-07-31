/* Este archivo envía un saludo al ingresar al servidor con ruta vacía */

const bienvenida = ( req, res ) => {
    res.status(201).json({ message: 'Bienvenidx al servidor'});
};

module.exports = bienvenida;
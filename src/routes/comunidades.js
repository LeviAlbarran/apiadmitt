const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

var findComunidadByName = function(nombre_comunidad, callback) {

    mysqlConnection.query('select * from comunidad where ')
    if (!comunidad[username])
        return callback(new Error(
            'No user matching ' +
            username
        ));
    return callback(null, users[username]);
};


router.get('/comunidades', (req, res) => {
    mysqlConnection.query('SELECT * FROM comunidad', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/comunidades/id/:id_comunidad', (req, res) => {
    const { id_comunidad } = req.params;
    mysqlConnection.query('SELECT * FROM comunidad WHERE id_comunidad = ?', [id_comunidad], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/comunidad_usuario/ultima_comunidad', (req, res) => {
    const query = `
    SELECT * FROM comunidad WHERE id_comunidad = (SELECT MAX(id_comunidad) FROM comunidad) 
    `;
    mysqlConnection.query(query, (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

// Seleccionar comunidades de un usuario por correo
router.get('/comunidad_usuario/correo/:correo_usuario/:miembro_subcomunidad', (req, res) => {
    const { correo_usuario, miembro_subcomunidad } = req.params;
    const query = `
    SELECT distinct id_comunidad, nombre_comunidad, descripcion_comunidad 
    FROM comunidad 
    LEFT JOIN subcomunidad ON fk_comunidad = id_comunidad 
    LEFT JOIN subcomunidad_usuario on  pk_subcomunidad = id_subcomunidad
    LEFT JOIN usuario ON pk_usuario = id_usuario 
    WHERE (correo_usuario = ? AND miembro_subcomunidad=?) or 
    (usuario_creador = 
    (select id_usuario from usuario where correo_usuario = ? order by id_usuario desc limit 1)) 
    `;
    mysqlConnection.query(query, [correo_usuario, miembro_subcomunidad, correo_usuario], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/comunidades/nombre/:nombre_comunidad', (req, res) => {
    const { nombre_comunidad } = req.params;
    mysqlConnection.query('SELECT * FROM comunidad WHERE nombre_comunidad = ?', [nombre_comunidad], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.post('/crear_comunidad', (req, res) => {
    const { nombre_comunidad, descripcion_comunidad, usuario_creador } = req.body;
    mysqlConnection.query('INSERT INTO comunidad (nombre_comunidad, descripcion_comunidad, usuario_creador) values (?,?,?)', [nombre_comunidad, descripcion_comunidad, usuario_creador],
        (err, rows, fields) => {
            if (!err) {
                res.json({ status: 'Ok' });
            } else {
                console.log(err);
            }
        });
});

router.delete('/eliminar_comunidad/:id_comunidad', (req, res) => {
    const {id_comunidad} = req.params;
    mysqlConnection.query('DELETE FROM comunidad WHERE id_comunidad = ?', [id_comunidad], (err, rows, fields) =>{
        if(!err){
            res.json({Status: 'Comunidad Eliminada'});
        }else{
            console.log(err);
        }
    });
});


router.get('/comunidades/cantidad_subcomunidades/:id_comunidad', (req, res) => {
    const { id_comunidad } = req.params;
    mysqlConnection.query('SELECT COUNT(*) as cantidad FROM subcomunidad WHERE fk_comunidad = ?', [id_comunidad], (err, rows, fields) => {
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});


router.put('/modificar_comunidad', (req, res) => {
    const {nombre_comunidad, descripcion_comunidad, id_comunidad} = req.body;
    console.log(req.body);
    mysqlConnection.query(`UPDATE comunidad 
    set nombre_comunidad = ?, descripcion_comunidad = ?
    where id_comunidad = ?
        `
        , [nombre_comunidad, descripcion_comunidad, id_comunidad], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});


module.exports = router;
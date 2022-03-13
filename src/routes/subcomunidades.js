const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

var findsubComunidadByName = function(nombre_subcomunidad, callback) {

    mysqlConnection.query('select * from subcomunidad where ')
    if (!subcomunidad[username])
        return callback(new Error(
            'No user matching ' +
            username
        ));
    return callback(null, users[username]);
};


router.get('/subcomunidades', (req, res) => {
    mysqlConnection.query('SELECT * FROM subcomunidad', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/subcomunidades/id/:id_subcomunidad', (req, res) => {
    const { id_subcomunidad } = req.params;
    mysqlConnection.query('SELECT * FROM subcomunidad WHERE id_subcomunidad = ?', [id_subcomunidad], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/subcomunidades/nombre/:nombre_subcomunidad', (req, res) => {
    const { nombre_subcomunidad } = req.params;
    mysqlConnection.query('SELECT * FROM subcomunidad WHERE nombre_subcomunidad = ?', [nombre_subcomunidad], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/subcomunidades/:id_comunidad', (req, res) => {
    const { id_comunidad } = req.params;
    mysqlConnection.query('SELECT * FROM subcomunidad WHERE fk_comunidad = ?', [id_comunidad], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.post('/crear_subcomunidad', (req, res) => {
    const { nombre_subcomunidad, descripcion_subcomunidad, fk_comunidad, id_subcomunidad_padre } = req.body;
    mysqlConnection.query('INSERT INTO subcomunidad (nombre_subcomunidad, descripcion_subcomunidad, fk_comunidad, id_subcomunidad_padre) values (?,?,?,?)', [nombre_subcomunidad, descripcion_subcomunidad, fk_comunidad, id_subcomunidad_padre],
        (err, rows, fields) => {
            if (!err) {
                res.json({ status: 'Ok' });
            } else {
                console.log(err);
            }
        });
});

router.put('/modificar_subcomunidad', (req, res) => {
    const {nombre_subcomunidad, descripcion_subcomunidad, id_subcomunidad} = req.body;
    console.log(req.body);
    mysqlConnection.query(`UPDATE subcomunidad 
    set nombre_subcomunidad = ?, descripcion_subcomunidad = ?
    where id_subcomunidad = ?
        `
        , [nombre_subcomunidad, descripcion_subcomunidad, id_subcomunidad], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.delete('/eliminar_subcomunidad/:id_subcomunidad', (req, res) => {
    const {id_subcomunidad} = req.params;
    mysqlConnection.query('DELETE FROM subcomunidad WHERE id_subcomunidad = ?', [id_subcomunidad], (err, rows, fields) =>{
        if(!err){
            res.json({Status: 'Subcomunidad Eliminada'});
        }else{
            console.log(err);
        }
    });
});

module.exports = router;
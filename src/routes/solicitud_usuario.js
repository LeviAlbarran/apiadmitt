const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/solicitud_usuario_votado/:fk_usuario', (req, res) => {
    const { fk_usuario } = req.params;
    mysqlConnection.query('SELECT * FROM solicitud_usuario WHERE  fk_usuario=?', [fk_usuario], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});



router.post('/crear_solicitud_usuario', (req, res) => {
    const { fk_solicitud, fk_usuario, voto } = req.body;
    const query = `INSERT INTO solicitud_usuario (fk_solicitud, fk_usuario, voto) VALUES (?,?,?);`
    mysqlConnection.query(query, [fk_solicitud, fk_usuario, voto],
        (err, rows, fields) => {
            if (!err) {
                res.json({ status: 'Ok' });
            } else {
                console.log(err);
            }
        });



        
        // Agregar logica para comprobar si cumple la cuota de aprobaciòn para ingresar a la comunidad
        // const query = 'UPDATE solicitud SET estado_solicitud = ? WHERE id_solicitud =? ;';
        // mysqlConnection.query(query, [estado_solicitud, idSolicitud], (err, rows, fields) => {
        //     if (!err) {
        //         res.json(rows);
    
        //     } else {
        //         console.log(err);
        //     }
        // });



});







module.exports = router;
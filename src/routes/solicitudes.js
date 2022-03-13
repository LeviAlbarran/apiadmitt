const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/solicitud_subcomunidad/:fk_subcomunidad_solicitud/:estado_solicitud', (req, res) => {
    const { fk_subcomunidad_solicitud, estado_solicitud } = req.params;
    mysqlConnection.query('SELECT * FROM solicitud WHERE fk_subcomunidad_solicitud=? AND estado_solicitud=?', [fk_subcomunidad_solicitud, estado_solicitud], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/solicitud/usuario/:fk_usuario_solicitud/:estado_solicitud', (req, res) => {
    const { fk_usuario_solicitud, estado_solicitud } = req.params;
    console.log(req.params);
    mysqlConnection.query("SELECT su.nombre_subcomunidad, su.descripcion_subcomunidad, s.* FROM solicitud s inner join subcomunidad su on su.id_subcomunidad = s.fk_subcomunidad_solicitud WHERE s.fk_usuario_solicitud=? AND s.estado_solicitud = ?", [fk_usuario_solicitud, estado_solicitud], (err, rows, fields) => {
        if (!err) {
            console.log(req.params);
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

// solicitudes de un usuario a una comunidad (en caso de haber sido rechazado puede er una lista)
router.get('/solicitud_subcomunidad/usuario/:fk_subcomunidad_solicitud/:fk_usuario_solicitud', (req, res) => {
    const { fk_subcomunidad_solicitud, fk_usuario_solicitud } = req.params;
    mysqlConnection.query('SELECT * FROM solicitud WHERE fk_subcomunidad_solicitud=? AND fk_usuario_solicitud=?', [fk_subcomunidad_solicitud, fk_usuario_solicitud], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});



router.post('/crear_solicitud', (req, res) => {
    const { fk_subcomunidad_solicitud, fk_usuario_solicitud, voto_maximo, descripcion_solicitud } = req.body;
    const query = `
        INSERT INTO Solicitud (fk_subcomunidad_solicitud, fk_usuario_solicitud, voto_maximo, 
            negativas_acumuladas, estado_solicitud, descripcion_solicitud)
        VALUES
        (?,?,?,?,?,?)
    `;
    mysqlConnection.query(query, [fk_subcomunidad_solicitud, fk_usuario_solicitud, voto_maximo,
            '0', 'p', descripcion_solicitud
        ],
        (err, rows, fields) => {
            if (!err) {
                res.json({ status: 'Ok' });
            } else {
                console.log(err);
            }
        });
});



router.put('/modificar_solicitud_voto/:idSolicitud', (req, res) => {
    const { idSolicitud } = req.params;
    const { estado_solicitud } = req.body;

    // Logica 
    //////////////////////////////////////////////////////////////////////////
    

    //////////////////////////////////////////////////////////////////////////


    const query = 'UPDATE solicitud SET estado_solicitud = ? WHERE id_solicitud =? ;';
    mysqlConnection.query(query, [estado_solicitud, idSolicitud], (err, rows, fields) => {
        if (!err) {
            res.json(rows);

        } else {
            console.log(err);
        }
    });
});

router.put('/modificar_solicitud_estado/:idSolicitud', (req, res) => {
    const { idSolicitud } = req.params;
    const { negativas_acumuladas, estado_solicitud } = req.body;
    const query = 'UPDATE solicitud SET negativas_acumuladas=? , estado_solicitud = ? WHERE id_solicitud =? ;';
    mysqlConnection.query(query, [negativas_acumuladas, estado_solicitud, idSolicitud], (err, rows, fields) => {
        if (!err) {
            res.json(rows);

        } else {
            console.log(err);
        }
    });
});



module.exports = router;
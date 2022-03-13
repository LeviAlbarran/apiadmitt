const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');


// Ver las comentarios de un usuario
router.get('/comentarios/publicacion/:fk_publicacion', (req, res) => {
    const { fk_publicacion } = req.params;
    mysqlConnection.query(`SELECT id_comentario, 
    comentario, nombre_usuario, apellido_usuario, id_usuario,
    (select mostrar as mostrar_contacto from solicitud_contacto 
        where solicitud_contacto.fk_publicacion = ?
        and fk_usuario = fk_usuario_solicitante
        order by id_solicitud_contacto desc limit 1) as mostrar_contacto
    FROM comentarios inner join usuario on id_usuario = fk_usuario 
    
    WHERE comentarios.fk_publicacion = ? `, [fk_publicacion, fk_publicacion], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/solicitud_contacto/publicacion/:fk_publicacion/usuario/:fk_usuario_solicitante', (req, res) => {
    const {fk_usuario_solicitante,  fk_publicacion } = req.params;
    mysqlConnection.query(`SELECT solicitud_contacto.*, telefono_usuario, correo_usuario FROM solicitud_contacto
    inner join usuario on id_usuario = fk_usuario_solicitante 
    WHERE fk_publicacion = ? and fk_usuario_solicitante = ?`, 
    [fk_publicacion, fk_usuario_solicitante], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.post('/crear_solicitud_contacto', (req, res) => {
    const { fk_usuario_solicitante, fk_publicacion } = req.body;
    mysqlConnection.query(`INSERT INTO solicitud_contacto (fk_usuario_solicitante, fk_publicacion)
        VALUES
        (?,?)`
        , [fk_usuario_solicitante, fk_publicacion], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.post('/modificar_solicitud_contacto', (req, res) => {
    const {mostrar, fk_usuario_solicitante, fk_publicacion } = req.body;
    console.log(req.body);
    mysqlConnection.query(`UPDATE solicitud_contacto 
    set mostrar = ?
    where fk_usuario_solicitante = ? and fk_publicacion = ?
        `
        , [mostrar, fk_usuario_solicitante, fk_publicacion], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});


router.post('/crear_comentarios', (req, res) => {
    const { comentario, fk_publicacion, fk_usuario} = req.body;
    
    // realFile = Buffer.from(flyer_comentarios, "base64");
    const query = `
        INSERT INTO comentarios (comentario, fk_publicacion, fk_usuario)
        VALUES
        (?,?,?)
    `;
    mysqlConnection.query(query, [comentario, fk_publicacion, fk_usuario],
        (err, rows, fields) => {
            if (!err) {
                res.json({ status: 'Ok' });
            } else {
                console.log(err);
            }
        });
});


router.delete('/eliminar_comentarios/:id_comentario', (req, res) => {
    const {id_comentario} = req.params;
    mysqlConnection.query('DELETE FROM comentarios WHERE id_comentario = ?', [id_comentario], (err, rows, fields) =>{
        if(!err){
            res.json({Status: 'Publicación Eliminada'});
        }else{
            console.log(err);
        }
    });
});

router.put('/modificar_comentarios/:id_comentario', (req, res) =>{
    const {id_comentarios, comentario} = req.params;
    const {titulo_comentarios, descripcion_comentarios, flyer_comentarios} = req.body;
    const query = 'UPDATE comentarios SET comentario = ? where id_comentarios =?;';
    mysqlConnection.query(query, [comentario,  id_comentarios], (err, rows, fields) =>{
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

module.exports = router;
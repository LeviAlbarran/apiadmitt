const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/categorias', (req, res) =>{
    mysqlConnection.query('SELECT * FROM categoria', (err, rows, fields) =>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

router.get('/categorias/subcomunidad/:id_subcomunidad', (req, res) =>{
	const { id_subcomunidad } = req.params;
    mysqlConnection.query('SELECT * FROM categoria inner join publicacion on fk_categoria = id_categoria inner join subcomunidad on fk_subcomunidad_publicacion = id_subcomunidad where id_subcomunidad = ? and flyer_publicacion is not null  group by id_categoria', [id_subcomunidad], (err, rows, fields) =>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});
 
module.exports = router;
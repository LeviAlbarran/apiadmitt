const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb)  {
      cb(null, __dirname + '/upload')
    },
    filename: function (req, file, cb) {
        console.log(req.body.nombre);
  
        if(file) {
            var path =  req.body.nombre;
            var archivo = path +'.'+ file.originalname.split('.').pop();
            cb(null, archivo)
        }

    }
  
  })
   
  var upload = multer({ storage: storage })

// Ver las publicaciones dependiendo de un tipo de publicacion

router.get('/publicaciones/:fk_tipo_publicacion', (req, res) => {
    const { fk_tipo_publicacion } = req.params;
    mysqlConnection.query('SELECT * FROM publicacion WHERE fk_tipo_publicacion = ?', [fk_tipo_publicacion], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/publicaciones/', (req, res) => {
    mysqlConnection.query('SELECT * FROM publicacion', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});


// Ver las publicaciones de un usuario por tipo de publicacion
router.get('/publicaciones/usuario/:fk_usuario_publicacion/:fk_tipo_publicacion', (req, res) => {
    const { fk_usuario_publicacion, fk_tipo_publicacion } = req.params;
    mysqlConnection.query('SELECT * FROM publicacion WHERE fk_usuario_publicacion = ? AND fk_tipo_publicacion = ?', [fk_usuario_publicacion, fk_tipo_publicacion], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/publicaciones/subcomunidad/:fk_subcomunidad_publicacion/:fk_tipo_publicacion', (req, res) => {
    const { fk_subcomunidad_publicacion, fk_tipo_publicacion } = req.params;
    mysqlConnection.query('SELECT * FROM publicacion WHERE fk_subcomunidad_publicacion = ? AND fk_tipo_publicacion = ?', [fk_subcomunidad_publicacion, fk_tipo_publicacion], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/publicaciones/flyer/:fk_subcomunidad_publicacion/:fk_usuario_publicacion/:fk_tipo_publicacion', (req, res) => {
    const { fk_subcomunidad_publicacion, fk_tipo_publicacion, fk_usuario_publicacion } = req.params;
    mysqlConnection.query('SELECT * FROM publicacion WHERE fk_subcomunidad_publicacion = ? AND fk_tipo_publicacion = ? AND fk_usuario_publicacion = ?', [fk_subcomunidad_publicacion, fk_tipo_publicacion, fk_usuario_publicacion], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

// Ver las publicaciones de un usuario
router.get('/publicaciones/usuario/:fk_usuario_publicacion', (req, res) => {
    const { fk_usuario_publicacion } = req.params;
    mysqlConnection.query('SELECT * FROM publicacion WHERE fk_usuario_publicacion = ?', [fk_usuario_publicacion], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});


router.post('/crear_publicacion', async (req, res) => {
    const { fk_tipo_publicacion, titulo_publicacion, descripcion_publicacion, flyer_publicacion, fk_subcomunidad_publicacion, fk_usuario_publicacion, flyer_link, fk_categoria } = req.body;
    console.log(flyer_publicacion);
    // realFile = Buffer.from(flyer_publicacion, "base64");
    const query = `
        INSERT INTO Publicacion (fk_tipo_publicacion, titulo_publicacion, descripcion_publicacion, 
            flyer_publicacion, fk_subcomunidad_publicacion, fk_usuario_publicacion,flyer_link, fk_categoria)
        VALUES
        (?,?,?,?,?,?,?,?)
    `;
    mysqlConnection.query(query, [fk_tipo_publicacion, titulo_publicacion, descripcion_publicacion, flyer_publicacion, fk_subcomunidad_publicacion, fk_usuario_publicacion, flyer_link, fk_categoria],
        (err, rows, fields) => {
            if (!err) {
                const query2 = 'SELECT id_publicacion FROM publicacion ORDER BY id_publicacion DESC LIMIT 1';
                mysqlConnection.query(query2, [],
                (err, rows, fields) => {
                if(!err){
                    console.log(query2);
                    res.json({ status: 'Ok', id: rows[0].id_publicacion});            
                } else {
                    console.log(err);
                }});
         
            } else {
                console.log(err);
            }
        });
});




router.delete('/eliminar_publicacion/:id_publicacion', (req, res) => {
    const {id_publicacion} = req.params;
    mysqlConnection.query('DELETE FROM publicacion WHERE id_publicacion = ?', [id_publicacion], (err, rows, fields) =>{
        if(!err){
            res.json({Status: 'Publicación Eliminada'});
        }else{
            console.log(err);
        }
    });
});


router.put('/modificar_publicacion/:id_publicacion', (req, res) =>{
    const {id_publicacion} = req.params;
    const {titulo_publicacion, descripcion_publicacion, flyer_publicacion} = req.body;
    var sqlpublicacion = '';
    var parametros = [titulo_publicacion, descripcion_publicacion,  id_publicacion];
  /*  if(flyer_publicacion){
        sqlpublicacion = 'flyer_publicacion= ?';
        parametros =  [titulo_publicacion, descripcion_publicacion, id_publicacion];
    }*/
    const query = `UPDATE publicacion SET titulo_publicacion = ?, descripcion_publicacion=? ${sqlpublicacion} where id_publicacion =?;`;
    mysqlConnection.query(query, parametros, (err, rows, fields) =>{
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});



router.post('/subir_archivo', upload.single('file'), async (req, res, next) => {
  const file = req.file;
  const {nombre, id} = req.body;
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  var path = req.body.nombre;
  var archivo = path +'.'+ file.originalname.split('.').pop();
  const query = 'UPDATE publicacion SET flyer_publicacion = ? where id_publicacion =?;';
  mysqlConnection.query(query, [archivo, id], (err, rows, fields) =>{
      if(!err){
        res.json({ status: 'Ok'});
    } else {
          console.log(err);
      }
  });
 

});

module.exports = router;
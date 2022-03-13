const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');
const { route } = require('./publicaciones');


router.get('/comuser/', (req, res) => {
    mysqlConnection.query('SELECT * FROM subcomunidad_usuario', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/comuser/usuarios/:pk_subcomunidad/:miembro_subcomunidad', (req, res) => {
    const { pk_subcomunidad, miembro_subcomunidad } = req.params;
    mysqlConnection.query('SELECT * FROM subcomunidad_usuario WHERE pk_subcomunidad=? AND miembro_subcomunidad=?', [pk_subcomunidad, miembro_subcomunidad],
        (err, rows, fields) => {
            if (!err) {
                res.json(rows);
            } else {
                console.log(err);
            }
        });
});




router.post('/crear_comuser', (req, res) => {
    const { pk_subcomunidad, pk_usuario } = req.body;
    const query = `INSERT INTO subcomunidad_usuario (pk_subcomunidad , pk_usuario , cantidad_flyer , cantidad_muro , cantidad_dato , miembro_subcomunidad) VALUES (?,?,?,?,?,?)`;
    mysqlConnection.query(query, [pk_subcomunidad, pk_usuario, '0', '0', '0', 's'],
    (err, rows, fields) => {

        const querySolicitud = `
        
        insert into solicitud (descripcion_solicitud, fk_subcomunidad_solicitud, fk_usuario_solicitud, voto_maximo, negativas_acumuladas, estado_solicitud) 
        values ('', ${pk_subcomunidad}, ${pk_usuario} , 0, 0, 'a')
        `;
        mysqlConnection.query(querySolicitud, [pk_subcomunidad, pk_usuario],
        (err, rows, fields) => {

            if (!err) {
                res.json({ status: 'Ok' });
            } else {
                console.log(err);
            }
        });
        });

});

router.post('/crear_comuser_solicitud', (req, res) => {
    const { pk_subcomunidad, pk_usuario } = req.body;
    const query = `INSERT INTO subcomunidad_usuario (pk_subcomunidad , pk_usuario , cantidad_flyer , cantidad_muro , cantidad_dato , miembro_subcomunidad) VALUES (?,?,?,?,?,?)`;
    mysqlConnection.query(query, [pk_subcomunidad, pk_usuario, '0', '0', '0', 'n'],
        (err, rows, fields) => {
            if (!err) {
                res.json({ status: 'Ok' });
            } else {
                console.log(err);
            }
        });
});


//actualizar cualquier elemento de la tabla

router.put('/update_comuser/:pk_subcomunidad/:pk_usuario', (req, res) => {
    const { cantidad_flyer, cantidad_muro, cantidad_dato, miembro_subcomunidad } = req.body;
    const { pk_subcomunidad, pk_usuario } = req.params;
    const query = `
    UPDATE subcomunidad_usuario SET  cantidad_flyer = ?, cantidad_muro = ?, cantidad_dato = ?, miembro_subcomunidad =? WHERE pk_subcomunidad =? AND pk_usuario=?
      `;
    mysqlConnection.query(query, [cantidad_flyer, cantidad_muro, cantidad_dato, miembro_subcomunidad, pk_subcomunidad, pk_usuario], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });

});

//actualizar solo si es miembro
router.put('/update_comuser/miembro/:pk_subcomunidad/:pk_usuario', (req, res) => {
    const { pk_subcomunidad, pk_usuario } = req.params;
    const { miembro_subcomunidad } = req.body;

    const query = `
    UPDATE subcomunidad_usuario SET  miembro_subcomunidad =? WHERE pk_subcomunidad =? AND pk_usuario=?
      `;
    mysqlConnection.query(query, [miembro_subcomunidad, pk_subcomunidad, pk_usuario], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });

});



router.delete('/eliminar_publicacion/:id_publicación', (req, res) => {
    const { id_publicacion } = req.params;
    mysqlConnection.query('DELETE FROM publicacion WHERE id_publicacion = ?', [id_publicacion], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 'Publicación eliminada' });
        } else {
            console.log(err);
        }
    });
});

// Seleccionar comunidades de un usuario por id de usuario

router.get('/subcomunidad_usuario/usuario/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    const query = `
    SELECT * FROM subcomunidad_usuario INNER JOIN usuario ON pk_usuario = id_usuario INNER JOIN subcomunidad ON pk_subcomunidad = id_subcomunidad WHERE id_usuario = ? 
    `;
    mysqlConnection.query(query, [id_usuario], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});
// Seleccionar subcomunidades de un usuario por correo
router.get('/subcomunidad_usuario/correo/:correo_usuario/:miembro_subcomunidad', (req, res) => {
    const { correo_usuario, miembro_subcomunidad } = req.params;
    const query = `
    SELECT id_subcomunidad, nombre_subcomunidad, descripcion_subcomunidad FROM subcomunidad_usuario INNER JOIN usuario ON pk_usuario = id_usuario INNER JOIN subcomunidad ON pk_subcomunidad = id_subcomunidad WHERE correo_usuario = ? AND miembro_subcomunidad=? 
    `;
    mysqlConnection.query(query, [correo_usuario, miembro_subcomunidad], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});



// Seleccionar comunidades del usuario a las que pertenece
router.get('/subcomunidad_usuario/id/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    const query = `
    SELECT id_subcomunidad, nombre_subcomunidad, descripcion_subcomunidad FROM subcomunidad_usuario INNER JOIN usuario ON pk_usuario = id_usuario INNER JOIN subcomunidad ON pk_subcomunidad = id_subcomunidad WHERE id_usuario = ? AND miembro_subcomunidad=? 
    `;
    mysqlConnection.query(query, [id_usuario, 's'], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});
//Selecciona las columnas con la pk_subcomunidad dada
router.get('/subcomunidad_usuario/comuser/:id_subcomunidad/:id_usuario', (req, res) => {
    const { id_subcomunidad, id_usuario } = req.params;
    const query = `
    SELECT * FROM subcomunidad_usuario WHERE pk_subcomunidad = ? AND pk_usuario = ?
    `;
    mysqlConnection.query(query, [id_subcomunidad, id_usuario], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

// Seleccionar usuarios de una comunidad
router.get('/subcomunidad_usuario/subcomunidad/:id_subcomunidad', (req, res) => {
    const { id_subcomunidad } = req.params;
    const query = `
    SELECT id_usuario, nombre_usuario, apellido_usuario, correo_usuario, telefono_usuario, premium_usuario, usuario_confirmado, contrasena_usuario,
    mostrar_contacto  
    FROM subcomunidad_usuario INNER JOIN usuario ON pk_usuario = id_usuario INNER JOIN subcomunidad ON pk_subcomunidad = id_subcomunidad WHERE id_subcomunidad = ? 
      AND miembro_subcomunidad = 's'
    `;
    mysqlConnection.query(query, [id_subcomunidad], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

// Seleccionar la ultima comunidad 
router.get('/subcomunidad_usuario/ultima_subcomunidad', (req, res) => {
    const query = `
    SELECT * FROM subcomunidad WHERE id_subcomunidad = (SELECT MAX(id_subcomunidad) FROM subcomunidad) 
    `;
    mysqlConnection.query(query, (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

// Seleccionar todos los usuarios que estén en comunidades
router.get('/subcomunidad_usuario', (req, res) => {
    const { id_subcomunidad } = req.params;
    const query = `
    SELECT * FROM subcomunidad_usuario INNER JOIN usuario ON pk_usuario = id_usuario INNER JOIN subcomunidad ON pk_subcomunidad = id_subcomunidad
    `;
    mysqlConnection.query(query, [id_subcomunidad], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/subcomunidad_usuario/cantidad_usuarios/:id_subcomunidad', (req, res) => {
    const { id_subcomunidad } = req.params;
    const query = `
    SELECT COUNT(*) as cantidad FROM subcomunidad_usuario WHERE pk_subcomunidad = ? and miembro_subcomunidad = 's'`;
    mysqlConnection.query(query, [id_subcomunidad], (err, rows, fields) => {
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});


router.get('/subcomunidad_usuario/flyers/:id_usuario/:fk_tipo_publicacion', (req, res) => {
    const { id_usuario, fk_tipo_publicacion } = req.params;
    const query = `
    SELECT id_publicacion, titulo_publicacion, flyer_publicacion, 
    nombre_categoria, nombre_subcomunidad, descripcion_publicacion, 
    nombre_usuario,
    apellido_usuario,
    id_usuario,
    DATE_FORMAT(fecha, '%d-%m-%Y')  as fecha, 
    (SELECT 
        COUNT(id_comentario)
    FROM
        comentarios where fk_publicacion = id_publicacion) as cantidad_comentarios
    FROM publicacion 
    INNER JOIN subcomunidad ON fk_subcomunidad_publicacion = id_subcomunidad 
    INNER JOIN categoria ON fk_categoria = id_categoria 
    INNER JOIN usuario ON fk_usuario_publicacion = id_usuario
    WHERE fk_usuario_publicacion = ? AND fk_tipo_publicacion = ?
    order by id_publicacion desc
    `;
    mysqlConnection.query(query, [id_usuario, fk_tipo_publicacion], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/subcomunidad_usuario/publicacion/:id_usuario/:fk_tipo_publicacion', (req, res) => {
    const { id_usuario, fk_tipo_publicacion } = req.params;
    const query = `
    SELECT id_publicacion, titulo_publicacion, flyer_publicacion, 
    nombre_categoria, nombre_subcomunidad, descripcion_publicacion, 
    (select nombre_usuario from usuario where id_usuario = fk_usuario_publicacion) as nombre_usuario,
    (select apellido_usuario from usuario where id_usuario = fk_usuario_publicacion) as apellido_usuario,

    fk_usuario_publicacion as id_usuario,
    (SELECT 
        COUNT(id_comentario)
    FROM
        comentarios where fk_publicacion = id_publicacion) as cantidad_comentarios
    FROM publicacion 
    INNER JOIN subcomunidad ON fk_subcomunidad_publicacion = id_subcomunidad 
    INNER JOIN categoria ON fk_categoria = id_categoria 
    INNER JOIN subcomunidad_usuario ON pk_subcomunidad = id_subcomunidad 
    INNER JOIN usuario ON pk_usuario = id_usuario
    WHERE id_usuario = ? AND fk_tipo_publicacion = ? AND miembro_subcomunidad = 's'
    `;
    mysqlConnection.query(query, [id_usuario, fk_tipo_publicacion], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/subcomunidad_usuario/flyers/:id_usuario/:fk_tipo_publicacion/:id_publicacion', (req, res) => {
    const { id_usuario, fk_tipo_publicacion, id_publicacion } = req.params;
    const query = `
    SELECT titulo_publicacion, flyer_publicacion, nombre_categoria, nombre_subcomunidad, descripcion_publicacion FROM publicacion 
    INNER JOIN subcomunidad ON fk_subcomunidad_publicacion = id_subcomunidad 
    INNER JOIN categoria ON fk_categoria = id_categoria 
    WHERE fk_usuario_publicacion = ? AND fk_tipo_publicacion = ? AND where id_publicacion = ?
    `;
    mysqlConnection.query(query, [id_usuario, fk_tipo_publicacion, id_publicacion], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/subcomunidad_usuario/flyers_swipper/:fk_subcomunidad_publicacion/:fk_tipo_publicacion', (req, res) => {
    const { fk_tipo_publicacion, fk_subcomunidad_publicacion } = req.params;
    const query = `
    SELECT id_publicacion, titulo_publicacion, flyer_publicacion, nombre_categoria, nombre_subcomunidad, descripcion_publicacion FROM publicacion 
    INNER JOIN subcomunidad ON fk_subcomunidad_publicacion = id_subcomunidad 
    INNER JOIN categoria ON fk_categoria = id_categoria 
    WHERE fk_tipo_publicacion = ? AND fk_subcomunidad_publicacion = ? 
    `;
    mysqlConnection.query(query, [fk_tipo_publicacion, fk_subcomunidad_publicacion], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

//Obtiene todos los flyers de comunidades a las que pertenece
router.get('/subcomunidad_usuario/flyers_swipper_pertenece/:fk_tipo_publicacion/:id_usuario', (req, res) => {
    const { fk_tipo_publicacion, id_usuario, } = req.params;
    const query = `
    SELECT id_publicacion, titulo_publicacion, flyer_publicacion, nombre_categoria, nombre_subcomunidad, descripcion_publicacion FROM publicacion 
    INNER JOIN subcomunidad_usuario ON fk_subcomunidad_publicacion = pk_subcomunidad 
    INNER JOIN subcomunidad ON fk_subcomunidad_publicacion = id_subcomunidad 
    INNER JOIN categoria ON fk_categoria = id_categoria 
    WHERE fk_tipo_publicacion = ? and miembro_subcomunidad='s' and pk_usuario=?
    `;
    mysqlConnection.query(query, [fk_tipo_publicacion, id_usuario], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/subcomunidad_usuario/vermas/:fk_subcomunidad_publicacion/:fk_categoria/:fk_tipo_publicacion', (req, res) => {
    const { fk_tipo_publicacion, fk_subcomunidad_publicacion, fk_categoria } = req.params;
    const query = `
    SELECT id_publicacion, titulo_publicacion, flyer_publicacion, nombre_categoria, nombre_subcomunidad, descripcion_publicacion FROM publicacion 
    INNER JOIN subcomunidad ON fk_subcomunidad_publicacion = id_subcomunidad 
    INNER JOIN categoria ON fk_categoria = id_categoria 
    WHERE fk_tipo_publicacion = ? AND fk_subcomunidad_publicacion = ?  AND fk_categoria = ?
    `;
    mysqlConnection.query(query, [fk_tipo_publicacion, fk_subcomunidad_publicacion, fk_categoria], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.delete('/subcomunidad_usuario/eliminar_usuario/:id_usuario/:id_subcomunidad', (req, res) => {
    const {id_usuario, id_subcomunidad} = req.params;
    mysqlConnection.query('DELETE FROM subcomunidad_usuario WHERE pk_usuario = ? AND pk_subcomunidad = ?', [id_usuario, id_subcomunidad], (err, rows, fields) =>{
        if(!err){
            res.json({Status: 'Usuario Eliminad@'});
        }else{
            console.log(err);
        }
    });
});

router.post('/contacto/id/:pk_usuario/:pk_subcomunidad', (req, res) => {
    const {mostrar_contacto } = req.body;
    const { pk_subcomunidad, pk_usuario } = req.params;
    const query = `
    UPDATE subcomunidad_usuario SET mostrar_contacto = ? WHERE pk_subcomunidad =? AND pk_usuario=?
      `;
    mysqlConnection.query(query, [mostrar_contacto, pk_subcomunidad, pk_usuario], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

// Seleccionar los flyers de un usuario por comunidad
module.exports = router;
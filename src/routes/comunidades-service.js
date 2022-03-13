const express = require('express');
const jmespath = require('jmespath');
const router = express.Router();


//mysql 
// Conexion Sequelize Mysql
const db = require("../../models");
// Conexion Mysql
const mysqlConnection = require('../database');




// corregir servicio devolver campo estado_solicitud
router.get('/comunidad_service-v2/comunidad_usuario/correo/:correo_usuario/',  (req, res) => {
    const { correo_usuario, miembro_subcomunidad } = req.params;
     const queryComunidades = 
     `SELECT id_comunidad, nombre_comunidad, descripcion_comunidad,  0 id_subcomunidad, '' nombre_subcomunidad, '' descripcion_subcomunidad,
     0 id_subcomunidad_padre, 'a' estado_solicitud, 'comunidad' tipo, '' tipo_subcomunidad 
     FROM comunidad`;
/*
    const queryComunidades = `
    SELECT distinct 
    id_comunidad, nombre_comunidad, descripcion_comunidad,  0 id_subcomunidad, '' nombre_subcomunidad, '' descripcion_subcomunidad,
    0 id_subcomunidad_padre, 'a' estado_solicitud, 'comunidad' tipo, '' tipo_subcomunidad, IFNULL(miembro_subcomunidad, 'n') miembro_subcomunidad
    FROM comunidad
    LEFT JOIN subcomunidad ON fk_comunidad = id_comunidad
    LEFT JOIN subcomunidad_usuario on  pk_subcomunidad = id_subcomunidad
    LEFT JOIN usuario ON pk_usuario = id_usuario
    WHERE (correo_usuario = '${correo_usuario}' 
    AND miembro_subcomunidad='s') or 
    (usuario_creador =(select id_usuario from usuario where correo_usuario = '${correo_usuario}' order by id_usuario desc limit 1))    
    `;   
    */

    // const queryComunidades =  `SELECT distinct
    // id_comunidad, nombre_comunidad, descripcion_comunidad,  0 id_subcomunidad, '' nombre_subcomunidad, '' descripcion_subcomunidad,
    // 0 id_subcomunidad_padre, 'comunidad' tipo, '' tipo_subcomunidad, 
    // (select  IF(miembro_subcomunidad = 's' and miembro_subcomunidad is not null, 'a', 'p')
    // from subcomunidad_usuario 
    // inner join subcomunidad on id_subcomunidad = pk_subcomunidad
    // inner join usuario on id_usuario = pk_usuario 
    // where correo_usuario = '${correo_usuario}' and miembro_subcomunidad = 's' 
    // and id_comunidad = fk_comunidad
    // order by pk_usuario desc limit 1) as estado_solicitud
    // FROM comunidad `
    
    console.log(queryComunidades);
    // console.log('queryComunidades', queryComunidades);
   
    let comunidades = [];    
    mysqlConnection.query(`${queryComunidades}`, function (error, results, fields) {
        if (error) throw error;                        

        results.forEach(row => {
        
        let itemComunidades= {};   
        itemComunidades.id_comunidad = row.id_comunidad;
        itemComunidades.nombre_comunidad = row.nombre_comunidad;
        itemComunidades.descripcion_comunidad = row.descripcion_comunidad; 
        itemComunidades.miembro_subcomunidad = row.miembro_subcomunidad;  
        itemComunidades.estado_solicitud = row.estado_solicitud;         
        itemComunidades.subcomunidades = [];
        ////////////////////////////////////                                
        comunidades = [...comunidades, itemComunidades] 
                
        });
      
        return res.status(200).json({
            ok:true,  
            data:comunidades          
        }); 

      });
       
});

router.get('/subcomunidad_service-v2/comunidad_usuario/:id_usuario/:id_comunidad/:id_sub_comunidad',  (req, res) => {

    let id_usuario =  (!req.params.id_usuario || req.params.id_usuario == 0) ? '' : req.params.id_usuario;
    let id_comunidad =  (!req.params.id_comunidad || req.params.id_comunidad == 0) ? '' : req.params.id_comunidad;
    let id_sub_comunidad =  (!req.params.id_sub_comunidad || req.params.id_sub_comunidad == 0) ? '' : req.params.id_sub_comunidad;    
        
    
    var queryComunidad = '';
    var querySubcomunidad = ''; 
    if(req.params.id_comunidad !== '0'){
        queryComunidad = `co.id_comunidad = ${id_comunidad}`;
    }
    
    if(req.params.id_sub_comunidad !== '0'){
        querySubcomunidad = `and (a.id_subcomunidad_padre = ${id_sub_comunidad})`;
    }else{
        querySubcomunidad = `and (a.id_subcomunidad_padre = 0)`;
    }
    

    let querySubComunidades = `
    select distinct 0 id_comunidad, '' nombre_comunidad, '' descripcion_comunidad, a.fk_comunidad,
    a.id_subcomunidad, a.nombre_subcomunidad, a.descripcion_subcomunidad, a.id_subcomunidad_padre,
    b.mostrar_contacto,                
    (select estado_solicitud from solicitud where fk_usuario_solicitud= ${id_usuario} and fk_subcomunidad_solicitud = a.id_subcomunidad limit 1) estado_solicitud,
    'sub_comunidad' tipo, 'padre' tipo_subcomunidad, miembro_subcomunidad
    FROM comunidad co
    LEFT JOIN subcomunidad a on co.id_comunidad  = a.fk_comunidad
    LEFT JOIN subcomunidad_usuario b on  b.pk_subcomunidad =  a.id_subcomunidad
    LEFT JOIN usuario c ON c.id_usuario = b.pk_usuario
    LEFT JOIN solicitud s on (s.fk_subcomunidad_solicitud = b.pk_subcomunidad and s.fk_usuario_solicitud = c.id_usuario )
    where 

    ${queryComunidad}
    ${querySubcomunidad}
    and (b.miembro_subcomunidad='s' or b.miembro_subcomunidad is null) 
    `

    // console.log('querySubComunidades', querySubComunidades);
   
    let subcomunidades = [];    
    mysqlConnection.query(`${querySubComunidades}`, function (error, data, fields) {
        if (error) throw error; 
        /*
        let subcomunidadesPadre = data.filter( doc => doc.tipo_subcomunidad === 'padre')
        let subcomunidadHijos = data.filter( doc => doc.tipo_subcomunidad === 'hijo')
        subcomunidadesPadre.forEach(row => {
                    
            let itemSubComunidades= {};                            
            itemSubComunidades.id_subcomunidad = row.id_subcomunidad;
            itemSubComunidades.fk_comunidad = row.fk_comunidad;
            itemSubComunidades.nombre_subcomunidad = row.nombre_subcomunidad;
            itemSubComunidades.descripcion_subcomunidad = row.descripcion_subcomunidad;
            itemSubComunidades.estado_solicitud =  row.estado_solicitud;
            itemSubComunidades.miembro_subcomunidad =  row.miembro_subcomunidad;
            itemSubComunidades.mostrar_contacto =  row.mostrar_contacto;


            //itemSubComunidades.subcomunidades = obtenerSubcomunidadesProceso(row,subcomunidadHijos);                                        
            //subcomunidades = [...subcomunidades, itemSubComunidades] 
                    
        });
        /*if(id_sub_comunidad != '')  {                        

            let subcomunidadesResult = []            
            let rows = subcomunidades;            
            for (let row of rows){                                    
             let item = IterarProceso(rows, row, subcomunidadesResult);                  
            }             
            let datos = {
                "subcomunidades":  subcomunidadesResult
            }

            let resultadoQuery = jmespath.search(datos,"subcomunidades[?id_subcomunidad == `" + id_sub_comunidad + "`]")
            let resultadoFinal = [];
            if(resultadoQuery){
                if(resultadoQuery.length > 0){
                    resultadoFinal.push(resultadoQuery[0])
                }
              } 
                  return res.status(200).json(                    
                    resultadoFinal.length>0 ? resultadoFinal[0] :{subcomunidades: []}               
                ); 
        }
               */           
      
        return res.status(200).json({            
             data                     
        }); 

      });
    
});


const obtenerSubcomunidadesProceso = (subcomunidadPadre, subcomunidadHijos) => {
    let subcomunidades = [];    
    let existeSubComunidadHijo = subcomunidadHijos.filter(doc => doc.id_subcomunidad_padre == subcomunidadPadre.id_subcomunidad);    

    if(existeSubComunidadHijo.length > 0 ){
        existeSubComunidadHijo.forEach(row => {                    
            let itemSubComunidades= {};                            
            itemSubComunidades.id_subcomunidad = row.id_subcomunidad;
            itemSubComunidades.fk_comunidad = row.fk_comunidad;
            itemSubComunidades.nombre_subcomunidad = row.nombre_subcomunidad;
            itemSubComunidades.descripcion_subcomunidad = row.descripcion_subcomunidad; 
            itemSubComunidades.estado_solicitud =  row.estado_solicitud;
            itemSubComunidades.miembro_subcomunidad =  row.miembro_subcomunidad
            itemSubComunidades.mostrar_contacto =  row.mostrar_contacto;
            itemSubComunidades.subcomunidades = obtenerSubcomunidadesProceso(row, subcomunidadHijos)
            ////////////////////////////////////                                
            subcomunidades = [...subcomunidades, itemSubComunidades]                     
        });
       
    }    

    return subcomunidades;
};

const IterarProceso = (rows, item,subcomunidadesResult) => {

    let listResult = []
    for (let row of rows){ 
      let data = row;
      let itemSubcomunidad = row.subcomunidades;
      let lengthSubcomunidad = row.subcomunidades.length;
      listResult.push(data)    
      subcomunidadesResult.push(data) ;               
      if(lengthSubcomunidad > 0){        
        IterarProceso(itemSubcomunidad, row, subcomunidadesResult)
      }    
    }     
    return listResult;
  
    
  }


// Buscar Publicaciones Subcomunidades con filtros
router.post('/subcomunidad_usuario-v2/publicacion', 
(req, res) => {    

    let id_usuario =  (!req.body.id_usuario || req.body.id_usuario == 0) ? '' : req.body.id_usuario;
    let texto_busqueda = (!req.body.texto_busqueda || req.body.texto_busqueda == 0) ? '' : req.body.texto_busqueda;
    let id_categoria = (!req.body.id_categoria || req.body.id_categoria == 0) ? '' : req.body.id_categoria;
    let conimagenes = (!req.body.conimagenes || req.body.conimagenes == 0) ? '' : req.body.conimagenes;
    let muro = (!req.body.muro || req.body.muro == 0) ? '' : req.body.muro;
    let flyer = (!req.body.flyer || req.body.flyer == 0) ? '' : req.body.flyer;
    let id_subcomunidad = (!req.body.id_subcomunidad || req.body.id_subcomunidad == 0) ? '' : req.body.id_subcomunidad;
        

    const query = `
    SELECT r.*
    FROM (
    SELECT id_publicacion, fk_tipo_publicacion id_tipo_publicacion, titulo_publicacion, flyer_publicacion,
    categoria.id_categoria, nombre_categoria, id_subcomunidad, nombre_subcomunidad, descripcion_publicacion,
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
    WHERE fk_usuario_publicacion = fk_usuario_publicacion
    AND fk_tipo_publicacion in(1,2)
    AND miembro_subcomunidad = 's'
    ) as r
    WHERE 1 = 1
    ORDER BY r.id_tipo_publicacion
    `;    
        
    mysqlConnection.query(query, [], (err, rows, fields) => {        
        let datos = rows;                   
        datos = (id_usuario != '') ? datos.filter( doc => doc.id_usuario == id_usuario) : datos;        
        if(texto_busqueda != ''){    
            let expresion = new RegExp(`${texto_busqueda}.*`, "i");            
            datos = (texto_busqueda != '') ? datos.filter( doc => 
                expresion.test(doc.titulo_publicacion) ||                         
                expresion.test(doc.flyer_publicacion)  || 
                expresion.test(doc.nombre_subcomunidad)  || 
                expresion.test(doc.descripcion_publicacion)  || 
                expresion.test(doc.nombre_usuario)  || 
                expresion.test(doc.apellido_usuario) ||
                expresion.test(doc.nombre_categoria)
            ) : datos;
        }
        datos = (id_categoria != '') ? datos.filter( doc => doc.id_categoria == id_categoria) : datos;
        datos = (conimagenes == 1) ? datos.filter( doc => doc.flyer_publicacion != "" &&  doc.flyer_publicacion != null) : datos;
        datos = (id_subcomunidad != '') ? datos.filter( doc => doc.id_subcomunidad == id_subcomunidad) : datos;
        

        let listMuro = datos.filter( doc => doc.id_tipo_publicacion == 2)
        let listFlyer = datos.filter( doc => doc.id_tipo_publicacion == 1)

        listMuro = (muro == 0 && flyer == 1) ? [] : listMuro;
        listFlyer = (flyer == 0 && muro == 1) ? [] : listFlyer;

        // AND  (titulo_publicacion like '%Levi%' or flyer_publicacion like '%Levi%' OR nombre_subcomunidad like '%Levi%' 
        // OR descripcion_publicacion like '%Levi%' OR nombre_usuario like '%Levi%' OR apellido_usuario like '%Levi%')        
            
        if (!err) {
            return res.status(200).json({
                ok:true,
                cantidadMuro:  listMuro.length,
                cantidadFlyer:  listFlyer.length,
                muro: listMuro,
                flyer:datos      
            }); 
        } else {
            console.log(err);
        }
    });
});




const IterarProcesoIdSubcomunidad = (rows, item,subcomunidadesResult) => {

    let listResult = []
    for (let row of rows){ 
      let data = row;
      let itemSubcomunidad = row.subcomunidades;
      let lengthSubcomunidad = row.subcomunidades.length;
      listResult.push(row.id_subcomunidad)
      subcomunidadesResult.push(data) ;               
      if(lengthSubcomunidad > 0){        
        IterarProcesoIdSubcomunidad(itemSubcomunidad, row, subcomunidadesResult)
      }    
    }     
    return listResult;
  
    
  }

router.post('/crear_solicitud_usuario/subcomunidad/voto', (req, res) => {

    const { id_solicitud, id_usuario_solicitud, id_usuario_voto, id_subcomunidad, voto } = req.body;

    // http://localhost:3000/crear_solicitud_usuario/subcomunidad/voto/21/1/4/6/a

    const query = `INSERT INTO solicitud_usuario (fk_solicitud, fk_usuario, voto) VALUES (?,?,?);`
        mysqlConnection.query(query, [id_solicitud, id_usuario_voto, voto],(err, rows, fields) => {
            
            // Agregar logica para comprobar si cumple la cuota de aprobaciòn para ingresar a la comunidad
            let queryCantidadMiembrosSubcomunidad = `
            SELECT count( distinct fk_subcomunidad_solicitud) cantidad_miembros_subcomunidad
            FROM solicitud
            WHERE fk_subcomunidad_solicitud = ${id_subcomunidad}
            AND estado_solicitud = 'a'
            `
            let queryCantidadVotosSubcomunidad = `
            SELECT count(*) as cantidad_votos_subcomunidad
            FROM solicitud a 
            INNER JOIN solicitud_usuario b on a.id_solicitud = b.fk_solicitud
            WHERE fk_subcomunidad_solicitud = ${id_subcomunidad}
            AND fk_usuario_solicitud = ${id_usuario_solicitud}
            AND voto = 'a'
            `
            mysqlConnection.query(`${queryCantidadMiembrosSubcomunidad};${queryCantidadVotosSubcomunidad}`, function (error, results, fields) {
            
                let resultCantidadMiembrosSubcomunidad = results[0].length > 0 ? results[0][0].cantidad_miembros_subcomunidad : 0;
                let resultCantidadVotosSubcomunidad = results[1].length > 0 ? results[1][0].cantidad_votos_subcomunidad : 0;                

                let queryAprobacion = `
                select votos_aprobacion 
                from par_subcomunidad_aprobacion
                where ${resultCantidadMiembrosSubcomunidad} between miembros_desde and miembros_hasta
                `                                  
                mysqlConnection.query(`${queryAprobacion}`, function (error, results, fields) {
                    

                    let resultVotosAprobacion =  results.length > 0 ? results[0].votos_aprobacion : 0;
                    // console.log('resultCantidadVotosSubcomunidad', resultCantidadVotosSubcomunidad);
                    // console.log('resultVotosAprobacion', resultVotosAprobacion);

                    if(resultCantidadVotosSubcomunidad >= resultVotosAprobacion){
                        // console.log('OK ENTROOOO')
                        const queryUpdateSolicitud = `UPDATE solicitud SET estado_solicitud = 'a' WHERE id_solicitud = ${id_solicitud} ;`;
                        const queryUpdateSubcomunidadUsuario = `UPDATE subcomunidad_usuario SET miembro_subcomunidad = 's' 
                        WHERE pk_subcomunidad = ${id_subcomunidad} 
                        AND pk_usuario = ${id_usuario_solicitud} 
                        `;

                        // console.log('queryUpdateSubcomunidadUsuario', queryUpdateSubcomunidadUsuario);
                        mysqlConnection.query(`${queryUpdateSolicitud}`, [id_solicitud], (err, rows, fields) => {                       
                            mysqlConnection.query(`${queryUpdateSubcomunidadUsuario}`, [id_solicitud], (err, rows, fields) => {                       
                                return res.status(200).json(
                                    'OK'                                                         
                                );
                            })                                       
                        });
                    }else{
                        return res.status(200).json(
                            'OK'                                                         
                        );
                    }
          
                }); 
 

            });
            
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


router.get('/subcomunidad_usuario-v2/subcomunidad/:id_subcomunidad', (req, res) => {
    
    
    let id_sub_comunidad =  (!req.params.id_subcomunidad || req.params.id_subcomunidad == 0) ? '' : req.params.id_subcomunidad;    
            
    if(id_sub_comunidad == ''){
        return res.status(200).json(          
            null
        ); 
    }

    let querySubComunidades = `
    select distinct 0 id_comunidad, '' nombre_comunidad, '' descripcion_comunidad, a.fk_comunidad,
    a.id_subcomunidad, a.nombre_subcomunidad, a.descripcion_subcomunidad, a.id_subcomunidad_padre,
    IFNULL(s.estado_solicitud, 'n') estado_solicitud, 'sub_comunidad' tipo, 'padre' tipo_subcomunidad,
		id_usuario, nombre_usuario, apellido_usuario, correo_usuario, telefono_usuario, premium_usuario, usuario_confirmado, contrasena_usuario
    FROM comunidad co
    INNER JOIN subcomunidad a on co.id_comunidad  = a.fk_comunidad
    INNER JOIN subcomunidad_usuario b on  b.pk_subcomunidad =  a.id_subcomunidad
    INNER JOIN usuario c ON c.id_usuario = b.pk_usuario
    INNER JOIN solicitud s on (s.fk_subcomunidad_solicitud = b.pk_subcomunidad and s.fk_usuario_solicitud = c.id_usuario )
    where (b.miembro_subcomunidad='s' or b.miembro_subcomunidad is null)
    union all
    select distinct
    0 id_comunidad, '' nombre_comunidad, '' descripcion_comunidad, a.fk_comunidad,
    a.id_subcomunidad, a.nombre_subcomunidad, a.descripcion_subcomunidad, a.id_subcomunidad_padre,
    IFNULL(s.estado_solicitud, 'n') estado_solicitud, 'sub_comunidad' tipo,'hijo' tipo_subcomunidad,		
		id_usuario, nombre_usuario, apellido_usuario, correo_usuario, telefono_usuario, premium_usuario, usuario_confirmado, contrasena_usuario
    from subcomunidad a
    INNER JOIN subcomunidad_usuario b on  b.pk_subcomunidad =  a.id_subcomunidad
    INNER JOIN usuario c ON c.id_usuario = b.pk_usuario
    INNER JOIN solicitud s on (s.fk_subcomunidad_solicitud = b.pk_subcomunidad and s.fk_usuario_solicitud = c.id_usuario )		
    WHERE fk_comunidad = 0    
    and (b.miembro_subcomunidad='s' or b.miembro_subcomunidad is null)
    `

    // console.log('querySubComunidades', querySubComunidades);
   
    let subcomunidades = [];    
    mysqlConnection.query(`${querySubComunidades}`, function (error, results, fields) {
        if (error) throw error; 
        
        let subcomunidadesPadre = results.filter( doc => doc.tipo_subcomunidad === 'padre')
        let subcomunidadHijos = results.filter( doc => doc.tipo_subcomunidad === 'hijo')
        subcomunidadesPadre.forEach(row => {
                    
            let itemSubComunidades= {};                            
            itemSubComunidades.id_subcomunidad = row.id_subcomunidad;
            itemSubComunidades.fk_comunidad = row.fk_comunidad;
            itemSubComunidades.nombre_subcomunidad = row.nombre_subcomunidad;
            itemSubComunidades.descripcion_subcomunidad = row.descripcion_subcomunidad;
            itemSubComunidades.estado_solicitud =  row.estado_solicitud;
            // Campos de Usuario   
            /////////////////////////////////////////////////////////////////////
            itemSubComunidades.id_usuario = row.id_usuario;
            itemSubComunidades.nombre_usuario = row.nombre_usuario;
            itemSubComunidades.apellido_usuario = row.apellido_usuario;
            itemSubComunidades.correo_usuario = row.correo_usuario;
            itemSubComunidades.telefono_usuario = row.telefono_usuario;
            itemSubComunidades.premium_usuario = row.premium_usuario;
            itemSubComunidades.usuario_confirmado = row.usuario_confirmado;
            itemSubComunidades.contrasena_usuario = row.contrasena_usuario;
            /////////////////////////////////////////////////////////////////////

            itemSubComunidades.subcomunidades = obtenerSubcomunidadesUsuarioProceso(row,subcomunidadHijos);                                        
            subcomunidades = [...subcomunidades, itemSubComunidades] 
                    
        });
        if(id_sub_comunidad != '')  {                        

            let subcomunidadesResult = []            
            let rows = subcomunidades;            
            for (let row of rows){                                    
             let item = IterarProcesoUsuariosSubcomunidad(rows, row, subcomunidadesResult);                  
            }           
            
            console.log('subcomunidadesResult', subcomunidadesResult);

            let datos = {
                "subcomunidades":  subcomunidadesResult
            }

            // console.log('subcomunidadesResult', subcomunidadesResult)
            let resultadoQuery = jmespath.search(datos,"subcomunidades[?id_subcomunidad == `" + id_sub_comunidad + "`]")
            
          
            let resultadoFinal = [];            
            for (row of resultadoQuery) {
                // console.log('row', row);

                let itemFinal = {
                    id_usuario: row.id_usuario,
                    nombre_usuario: row.nombre_usuario,
                    apellido_usuario: row.apellido_usuario,
                    correo_usuario: row.correo_usuario,
                    telefono_usuario: row.telefono_usuario,
                    premium_usuario: row.premium_usuario,
                    usuario_confirmado: row.usuario_confirmado,
                    contrasena_usuario: row.contrasena_usuario
                }

                console.log('itemFinal', itemFinal);

                let existeUsuario = resultadoFinal.filter(doc => doc.id_usuario == row.id_usuario);
                console.log('existeUsuario', existeUsuario);
                if(existeUsuario.length === 0){
                    resultadoFinal.push(itemFinal)
                }
                     
            } 
 
            return res.status(200).json(
                resultadoFinal
            ); 

            // return res.status(200).json({                    
            //     subcomunidades: resultadoFinal                    
            // }); 
                
        }                                   

      });
});

const obtenerSubcomunidadesUsuarioProceso = (subcomunidadPadre, subcomunidadHijos) => {
    let subcomunidades = [];    
    // console.log('subcomunidadPadre.id_subcomunidad_padre', subcomunidadPadre.id_subcomunidad_padre)
    // console.log('subcomunidadHijos', subcomunidadHijos)
    let existeSubComunidadHijo = subcomunidadHijos.filter(doc => doc.id_subcomunidad_padre == subcomunidadPadre.id_subcomunidad);    

    if(existeSubComunidadHijo.length > 0 ){
        existeSubComunidadHijo.forEach(row => {                    
            let itemSubComunidades= {};                            
            itemSubComunidades.id_subcomunidad = row.id_subcomunidad;
            itemSubComunidades.fk_comunidad = row.fk_comunidad;
            itemSubComunidades.nombre_subcomunidad = row.nombre_subcomunidad;
            itemSubComunidades.descripcion_subcomunidad = row.descripcion_subcomunidad; 
            itemSubComunidades.estado_solicitud =  row.estado_solicitud;
            // Campos de Usuario   
            /////////////////////////////////////////////////////////////////////
            itemSubComunidades.id_usuario = row.id_usuario;
            itemSubComunidades.nombre_usuario = row.nombre_usuario;
            itemSubComunidades.apellido_usuario = row.apellido_usuario;
            itemSubComunidades.correo_usuario = row.correo_usuario;
            itemSubComunidades.telefono_usuario = row.telefono_usuario;
            itemSubComunidades.premium_usuario = row.premium_usuario;
            itemSubComunidades.usuario_confirmado = row.usuario_confirmado;
            itemSubComunidades.contrasena_usuario = row.contrasena_usuario;
            /////////////////////////////////////////////////////////////////////

            itemSubComunidades.subcomunidades = obtenerSubcomunidadesUsuarioProceso(row, subcomunidadHijos)
            ////////////////////////////////////                                
            subcomunidades = [...subcomunidades, itemSubComunidades]                     
        });
       
    }    

    return subcomunidades;
};

const IterarProcesoUsuariosSubcomunidad = (rows, item,subcomunidadesResult) => {

    let listResult = []
    for (let row of rows){ 
      let data = row;
      let itemSubcomunidad = row.subcomunidades;
      let lengthSubcomunidad = row.subcomunidades.length;
      listResult.push(data)    
      subcomunidadesResult.push(data) ;               
      if(lengthSubcomunidad > 0){        
        IterarProcesoUsuariosSubcomunidad(itemSubcomunidad, row, subcomunidadesResult)
      }    
    }     
    return listResult;
  
    
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ultimos Servicios

// Buscar Comunidades
router.get('/comunidad_service_usuario/comunidad_usuario/id_usuario/:id_usuario/', async  (req, res) => {
    const { id_usuario, miembro_subcomunidad } = req.params;
    
    const queryComunidades = 
    `
    SELECT id_comunidad, nombre_comunidad, descripcion_comunidad,  0 id_subcomunidad, '' nombre_subcomunidad, '' descripcion_subcomunidad,
    0 id_subcomunidad_padre, 'a' estado_solicitud, 'comunidad' tipo, '' tipo_subcomunidad 
    FROM comunidad    
    order by id_comunidad asc
    `;

    const results = await db.sequelize.query(queryComunidades, {
    type: db.sequelize.QueryTypes.SELECT
    });    

    let arregloValores= [];
    let comunidades = [];  
    let subcomunidadesPadre = []; 
    let subcomunidadHijos = []; 
    for await (row of results) {
     

        let querySubComunidades = `
        select distinct 0 id_comunidad, '' nombre_comunidad, '' descripcion_comunidad, a.fk_comunidad,
        a.id_subcomunidad, a.nombre_subcomunidad, a.descripcion_subcomunidad, a.id_subcomunidad_padre,
        b.mostrar_contacto,
        (select estado_solicitud from solicitud where fk_usuario_solicitud= ${id_usuario} and fk_subcomunidad_solicitud = a.id_subcomunidad limit 1) estado_solicitud,
        'sub_comunidad' tipo, 'padre' tipo_subcomunidad, miembro_subcomunidad
        FROM comunidad co
        LEFT JOIN subcomunidad a on co.id_comunidad  = a.fk_comunidad
        LEFT JOIN subcomunidad_usuario b on  b.pk_subcomunidad =  a.id_subcomunidad
        LEFT JOIN usuario c ON c.id_usuario = b.pk_usuario
        LEFT JOIN solicitud s on (s.fk_subcomunidad_solicitud = b.pk_subcomunidad and s.fk_usuario_solicitud = c.id_usuario )
        where 1 = 1 
        and fk_comunidad= ${row.id_comunidad}          
        and (b.miembro_subcomunidad='s' or b.miembro_subcomunidad is null)
        and id_subcomunidad_padre = 0
        union all
        select distinct
        0 id_comunidad, '' nombre_comunidad, '' descripcion_comunidad, a.fk_comunidad,
        a.id_subcomunidad, a.nombre_subcomunidad, a.descripcion_subcomunidad, a.id_subcomunidad_padre,
        b.mostrar_contacto,
        (select estado_solicitud from solicitud where fk_usuario_solicitud= ${id_usuario} and fk_subcomunidad_solicitud = a.id_subcomunidad limit 1) estado_solicitud,    
        'sub_comunidad' tipo,'hijo' tipo_subcomunidad, miembro_subcomunidad
        from subcomunidad a
        LEFT JOIN subcomunidad_usuario b on  b.pk_subcomunidad =  a.id_subcomunidad
        LEFT JOIN usuario c ON c.id_usuario = b.pk_usuario
        LEFT JOIN solicitud s on (s.fk_subcomunidad_solicitud = b.pk_subcomunidad and s.fk_usuario_solicitud = c.id_usuario )
        WHERE 1=1
        and id_subcomunidad_padre != 0       
        and (b.miembro_subcomunidad='s' or b.miembro_subcomunidad is null)
        `         

        const resultsSubcomunidades = await db.sequelize.query(querySubComunidades, {
            type: db.sequelize.QueryTypes.SELECT
        });
        

        arregloValores = resultsSubcomunidades;

        subcomunidadesPadre = resultsSubcomunidades.filter( doc => doc.tipo_subcomunidad === 'padre')
        subcomunidadHijos = resultsSubcomunidades.filter( doc => doc.tipo_subcomunidad === 'hijo')

        if(subcomunidadesPadre.length > 0 && subcomunidadHijos.length > 0){
            let subcomunidades = [];         
            for await (rowSubComunidadesPadre of subcomunidadesPadre) {                
                let itemSubComunidades= {};                            
                itemSubComunidades.id_subcomunidad = rowSubComunidadesPadre.id_subcomunidad;
                itemSubComunidades.fk_comunidad = rowSubComunidadesPadre.fk_comunidad;
                itemSubComunidades.nombre_subcomunidad = rowSubComunidadesPadre.nombre_subcomunidad;
                itemSubComunidades.descripcion_subcomunidad = rowSubComunidadesPadre.descripcion_subcomunidad;
                itemSubComunidades.estado_solicitud =  rowSubComunidadesPadre.estado_solicitud;
                itemSubComunidades.miembro_subcomunidad =  rowSubComunidadesPadre.miembro_subcomunidad;
                itemSubComunidades.mostrar_contacto =  rowSubComunidadesPadre.mostrar_contacto;
                itemSubComunidades.subcomunidades = obtenerSubcomunidadesProceso(rowSubComunidadesPadre,subcomunidadHijos);                                        
                subcomunidades = [...subcomunidades, itemSubComunidades] 
                        
            };

            console.log('subcomunidades', subcomunidades)
            
            let stringSubcomunidades = "";
            subcomunidades.map((rowSolicitud,i) => {
                stringSubcomunidades+= i == 0 ? rowSolicitud.id_subcomunidad : `,${rowSolicitud.id_subcomunidad}`;
            });        
                    
            let querySolicitud = `
            select estado_solicitud
            FROM solicitud
            WHERE fk_subcomunidad_solicitud in(${stringSubcomunidades})
            and fk_usuario_solicitud = ${id_usuario}
            and estado_solicitud = 'a'
            limit 1
            `
            
            const resultSolicitud = await db.sequelize.query(querySolicitud, {
                type: db.sequelize.QueryTypes.SELECT
            });
                        
            
            estadoSolicitud = resultSolicitud.length == 0 ? "n" : resultSolicitud[0].estado_solicitud ? resultSolicitud[0].estado_solicitud : "n";            
            
            /////////////////////////////////////////////////////

            let itemComunidades= {};   
            itemComunidades.id_comunidad = row.id_comunidad;        
            itemComunidades.nombre_comunidad = row.nombre_comunidad;
            itemComunidades.descripcion_comunidad = row.descripcion_comunidad; 
            itemComunidades.estado_solicitud= estadoSolicitud;                  
            comunidades = [...comunidades, itemComunidades];
        }else{ 
            let itemComunidades= {};   
            itemComunidades.id_comunidad = row.id_comunidad;        
            itemComunidades.nombre_comunidad = row.nombre_comunidad;
            itemComunidades.descripcion_comunidad = row.descripcion_comunidad; 
            itemComunidades.estado_solicitud= 'n';                  
            comunidades = [...comunidades, itemComunidades];
        }          
    }            
    return res.status(200).json({
        ok:true ,
        data: comunidades        
    }); 
       
});

// Buscar Publicaciones Flyers y Muros
router.get('/subcomunidad_usuario_service/publicacion/:id_usuario/:fk_tipo_publicacion/:id_comunidad/:id_sub_comunidad', async  (req, res) => {

    console.log('Buscar Publicaciones Muros y Flyer');
    console.log(req.params);
    let id_usuario =  (!req.params.id_usuario || req.params.id_usuario == 0) ? '' : req.params.id_usuario;
    let fk_tipo_publicacion =  (!req.params.fk_tipo_publicacion || req.params.fk_tipo_publicacion == 0) ? '' : req.params.fk_tipo_publicacion;
    let id_comunidad =  (!req.params.id_comunidad || req.params.id_comunidad == 0) ? '' : req.params.id_comunidad;
    let id_sub_comunidad =  (!req.params.id_sub_comunidad || req.params.id_sub_comunidad == 0) ? '' : req.params.id_sub_comunidad;    
    
    if(id_usuario == '' ||  fk_tipo_publicacion == ''){
        return res.status(200).json([]); 
    }

    let querySolicitudUsuario = `
    SELECT DISTINCT fk_subcomunidad_solicitud as id_subcomunidad
    FROM solicitud
    WHERE fk_usuario_solicitud = ${id_usuario}
    AND estado_solicitud = 'a'
    `
    const resultsSolicitudUsuario = await db.sequelize.query(querySolicitudUsuario, {
        type: db.sequelize.QueryTypes.SELECT
    }); 

    let usuarioPadreSubcomunidad= "";        
    if(resultsSolicitudUsuario.length > 0) {
    let querySolicitudUsuarioPadre = `
            select distinct pk_usuario
            from subcomunidad_usuario
            where pk_subcomunidad in(
            select distinct fk_subcomunidad_solicitud 
            from solicitud
            where fk_usuario_solicitud = ${id_usuario}
            and estado_solicitud = 'a'
            )
    `
    const resultsSolicitudUsuarioPadre = await db.sequelize.query(querySolicitudUsuarioPadre, {
        type: db.sequelize.QueryTypes.SELECT        
    }); 
    
    usuarioPadreSubcomunidad = resultsSolicitudUsuarioPadre.length > 0 ? resultsSolicitudUsuarioPadre[0].pk_usuario : ""
    }else{
        return res.status(200).json([]); 
    }

    if(id_comunidad == '' &&  id_sub_comunidad == '') {

        let sqlWhere = ''
        if(usuarioPadreSubcomunidad != id_usuario){
            sqlWhere = `
            where a.id_subcomunidad not in (
                select distinct
                          a.id_subcomunidad
                 from subcomunidad a
                 LEFT JOIN subcomunidad_usuario b on  b.pk_subcomunidad =  a.id_subcomunidad
                 LEFT JOIN usuario c ON c.id_usuario = b.pk_usuario
                 LEFT JOIN solicitud s on (s.fk_subcomunidad_solicitud = b.pk_subcomunidad and s.fk_usuario_solicitud = c.id_usuario )
                 WHERE 1 = 1
                 and id_subcomunidad_padre != 0
                 and (c.id_usuario = ${usuarioPadreSubcomunidad} or c.id_usuario is null)
                 and (b.miembro_subcomunidad='s' or b.miembro_subcomunidad is null)
                 )
          and a.id_subcomunidad not in (
                    select a.id_subcomunidad
                            from (
                                    select distinct 				
                                a.id_subcomunidad,
                                (select estado_solicitud from solicitud where fk_usuario_solicitud= 6 and fk_subcomunidad_solicitud = a.id_subcomunidad limit 1) estado_solicitud    
                                FROM comunidad co
                                LEFT JOIN subcomunidad a on co.id_comunidad  = a.fk_comunidad
                                LEFT JOIN subcomunidad_usuario b on  b.pk_subcomunidad =  a.id_subcomunidad
                                LEFT JOIN usuario c ON c.id_usuario = b.pk_usuario
                                LEFT JOIN solicitud s on (s.fk_subcomunidad_solicitud = b.pk_subcomunidad and s.fk_usuario_solicitud = c.id_usuario )
                                where 1 = 1
                                and (c.id_usuario = ${usuarioPadreSubcomunidad} or c.id_usuario is null)
                                and (b.miembro_subcomunidad='s' or b.miembro_subcomunidad is null)    
                                and id_subcomunidad_padre = 0
                            ) a
                    where a.estado_solicitud is null
                )
            `
        }

        console.log('usuarioPadreSubcomunidad');
        console.log(usuarioPadreSubcomunidad);
        let resultTodasLasPublicaciones = `
        select distinct *
        from (
        SELECT id_subcomunidad , id_subcomunidad_padre,
        id_publicacion, titulo_publicacion, flyer_publicacion,
        id_categoria, nombre_categoria, nombre_subcomunidad, descripcion_publicacion,
        DATE_FORMAT(fecha, '%d-%m-%Y')  as fecha,
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
        WHERE fk_tipo_publicacion = ${fk_tipo_publicacion}
        ${usuarioPadreSubcomunidad == '' ? '' : `AND fk_usuario_publicacion = ${usuarioPadreSubcomunidad}`}
        AND (miembro_subcomunidad = 's')
        ) as a  ${sqlWhere}

        `        
        // console.log('resultTodasLasPublicaciones', resultTodasLasPublicaciones);

        const results = await db.sequelize.query(resultTodasLasPublicaciones, {
            type: db.sequelize.QueryTypes.SELECT
        });  
                
        return res.status(200).json(                  
            results                                  
        ); 

    }    
    else{                   

    let querySubComunidades = `
    select distinct 0 id_comunidad, '' nombre_comunidad, '' descripcion_comunidad,
    a.id_subcomunidad, a.nombre_subcomunidad, a.descripcion_subcomunidad, a.id_subcomunidad_padre,    
    (select estado_solicitud from solicitud where fk_usuario_solicitud= ${id_usuario} and fk_subcomunidad_solicitud = a.id_subcomunidad limit 1) estado_solicitud,
    'sub_comunidad' tipo, 'padre' tipo_subcomunidad
    FROM comunidad co
    LEFT JOIN subcomunidad a on co.id_comunidad  = a.fk_comunidad
    LEFT JOIN subcomunidad_usuario b on  b.pk_subcomunidad =  a.id_subcomunidad
    LEFT JOIN usuario c ON c.id_usuario = b.pk_usuario
    LEFT JOIN solicitud s on (s.fk_subcomunidad_solicitud = b.pk_subcomunidad and s.fk_usuario_solicitud = c.id_usuario )
    where 1 = 1    
    and (c.id_usuario = ${usuarioPadreSubcomunidad} or c.id_usuario is null) 
    and (b.miembro_subcomunidad='s' or b.miembro_subcomunidad is null)
    and fk_comunidad = ${id_comunidad}
    and id_subcomunidad_padre = 0
    union all
    select distinct
    0 id_comunidad, '' nombre_comunidad, '' descripcion_comunidad,
    a.id_subcomunidad, a.nombre_subcomunidad, a.descripcion_subcomunidad, a.id_subcomunidad_padre,
    (select estado_solicitud from solicitud where fk_usuario_solicitud= ${usuarioPadreSubcomunidad} and fk_subcomunidad_solicitud = a.id_subcomunidad limit 1) estado_solicitud,
    'sub_comunidad' tipo,'hijo' tipo_subcomunidad
    from subcomunidad a
    LEFT JOIN subcomunidad_usuario b on  b.pk_subcomunidad =  a.id_subcomunidad
    LEFT JOIN usuario c ON c.id_usuario = b.pk_usuario
    LEFT JOIN solicitud s on (s.fk_subcomunidad_solicitud = b.pk_subcomunidad and s.fk_usuario_solicitud = c.id_usuario )
    WHERE 1 = 1
    and id_subcomunidad_padre != 0 
    and (c.id_usuario = ${usuarioPadreSubcomunidad} or c.id_usuario is null)   
    and (b.miembro_subcomunidad='s' or b.miembro_subcomunidad is null)
    ` 
    console.log('querySubComunidades xxx', querySubComunidades);
        
    let subcomunidades = [];    
    const results = await db.sequelize.query(querySubComunidades, {
        type: db.sequelize.QueryTypes.SELECT
    });  
                    
    if(results.length == 0){
        return res.status(200).json([]);
    }

    let subcomunidadesPadrePorUsuario = results.filter( doc => doc.tipo_subcomunidad === 'padre' && doc. estado_solicitud === 'a');

    if(subcomunidadesPadrePorUsuario.length == 0){
        return res.status(200).json([]);
    }
        
    let subcomunidadesPadre = results.filter( doc => doc.tipo_subcomunidad === 'padre')
    let subcomunidadHijos = results.filter( doc => doc.tipo_subcomunidad === 'hijo')
    
        
    for await (rowSubComunidadesPadre of subcomunidadesPadre) {           
        let itemSubComunidades= {};                            
        itemSubComunidades.id_subcomunidad = rowSubComunidadesPadre.id_subcomunidad;
        itemSubComunidades.nombre_subcomunidad = rowSubComunidadesPadre.nombre_subcomunidad;
        itemSubComunidades.descripcion_subcomunidad = rowSubComunidadesPadre.descripcion_subcomunidad;
        itemSubComunidades.estado_solicitud =  rowSubComunidadesPadre.estado_solicitud;
        itemSubComunidades.subcomunidades = obtenerSubcomunidadesProceso(rowSubComunidadesPadre,subcomunidadHijos);                                        
        subcomunidades = [...subcomunidades, itemSubComunidades]             
                
    };
             



        let subcomunidadesResult = []            
        let rows = subcomunidades;            
        for (let row of rows){                                    
            let item = IterarProceso(rows, row, subcomunidadesResult);                  
        }             
        let datos = {
            "subcomunidades":  subcomunidadesResult
        }

        let resultadoQuery = id_sub_comunidad != '' ? 
        jmespath.search(datos,"subcomunidades[?id_subcomunidad == `" + id_sub_comunidad + "`]") : subcomunidadesResult
       

        let resultadoFinal = [];
        if(id_sub_comunidad != ''){
            if(resultadoQuery){
                if(resultadoQuery.length > 0){                    

                    resultadoFinal.push(resultadoQuery[0])
                }
            }  
        }else{
            resultadoFinal = resultadoQuery;
        }
                                
        ///////////////////////////////////////////////////////////////////
        let listIdSubComunidades = []                        
        let filas = resultadoFinal; 
        for (let row of filas){                                    
            IterarProcesoIdSubcomunidad(filas, row, listIdSubComunidades);                  
        }                   
        let stringIdSubcomunidades = '';
        let indice = 0;
        for (let row of listIdSubComunidades){  
            if(indice === 0){
                stringIdSubcomunidades= row.id_subcomunidad;
            }else{
                stringIdSubcomunidades= stringIdSubcomunidades + "," + row.id_subcomunidad;
            }                
            indice ++;
        }
        if(stringIdSubcomunidades ===''){
            return res.status(200).json(                  
                []
            ); 
        }

        let queryPublicaciones = `
        select *
        from (
        SELECT id_subcomunidad , DATE_FORMAT(fecha, '%d-%m-%Y')  as fecha,  id_subcomunidad_padre,
        id_publicacion, titulo_publicacion, flyer_publicacion,
        nombre_categoria, nombre_subcomunidad, descripcion_publicacion,
        (select nombre_usuario from usuario where id_usuario = fk_usuario_publicacion) as nombre_usuario,
        (select apellido_usuario from usuario where id_usuario = fk_usuario_publicacion) as apellido_usuario,        
        fk_usuario_publicacion as id_usuario,
        (SELECT
            COUNT(id_comentario)
        FROM
            comentarios where fk_publicacion = id_publicacion) as cantidad_comentarios
        FROM publicacion
        LEFT JOIN subcomunidad ON fk_subcomunidad_publicacion = id_subcomunidad
        LEFT JOIN categoria ON fk_categoria = id_categoria
        LEFT JOIN subcomunidad_usuario ON pk_subcomunidad = id_subcomunidad
        LEFT JOIN usuario ON pk_usuario = id_usuario
        WHERE fk_tipo_publicacion = ${fk_tipo_publicacion}				            
        AND (miembro_subcomunidad = 's' OR miembro_subcomunidad IS NULL)
        ) as a
        WHERE id_subcomunidad in (${stringIdSubcomunidades})
        order by id_publicacion desc
        `

        // console.log('queryPublicaciones NUEVO', queryPublicaciones)

        
        const resultPublicaciones = await db.sequelize.query(queryPublicaciones, {
            type: db.sequelize.QueryTypes.SELECT
        }); 
        
        return res.status(200).json(                  
            resultPublicaciones                                  
        ); 

                             
    }
});

module.exports = router;


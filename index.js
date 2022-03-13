const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
require('dotenv').config();

//db 
const db = require("./models");
//const PORT_SEQUELIZE = 8000;


// Configuraciones
app.set('port', process.env.PORT || 80);

// Middlewares
app.use(express.json({ limit: '52428800b' }));
app.use(express.urlencoded({ limit: '52428800b', extended: true, parameterLimit: 50000 }));
app.use(express.json());



// Rutas
app.get('/api/estado', async function(req, res){
    return res.send({estado: true});
});

app.use('/upload', express.static(__dirname + '/src/routes/upload'));
app.use(require('./src/routes/usuarios'));
app.use(require('./src/routes/publicaciones'));
app.use(require('./src/routes/comunidades'));
app.use(require('./src/routes/subcomunidades'));
app.use(require('./src/routes/categorias'));
app.use(require('./src/routes/tipo_publicacion'));
app.use(require('./src/routes/subcomunidad_usuario'));
app.use(require('./src/routes/solicitudes'));
app.use(require('./src/routes/solicitud_usuario'));
app.use(require('./src/routes/imagenes'));
app.use(require('./src/routes/comentarios'));
app.use(require('./src/routes/comunidades-service'));

/*
db.sequelize.sync().then(() => {
    app.listen(PORT_SEQUELIZE, () => {
      console.log(`listening on http://localhost: ${PORT_SEQUELIZE}`);
    });
  });
*/
// Starting the server
app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto', app.get('port'));
    // console.log(__dirname + '/routes/upload');
});



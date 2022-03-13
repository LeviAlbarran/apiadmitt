const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

// Configuraciones
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(express.json({ limit: '52428800b' }));
app.use(express.urlencoded({ limit: '52428800b', extended: true, parameterLimit: 50000 }));
app.use(express.json());



// Rutas
app.get('/api/estado', async function(req, res){
    return res.send({estado: true});
});

app.use('/upload', express.static(__dirname + '/routes/upload'));
app.use(require('./routes/usuarios'));
app.use(require('./routes/publicaciones'));
app.use(require('./routes/comunidades'));
app.use(require('./routes/subcomunidades'));
app.use(require('./routes/categorias'));
app.use(require('./routes/tipo_publicacion'));
app.use(require('./routes/subcomunidad_usuario'));
app.use(require('./routes/solicitudes'));
app.use(require('./routes/solicitud_usuario'));
app.use(require('./routes/imagenes'));
app.use(require('./routes/comentarios'));

// Starting the server
app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto', app.get('port'));
    console.log(__dirname + '/routes/upload');
});



var fs = require('fs');
var bodyParser = require('body-parser');
var multer  = require('multer');
var upload = multer({ dest: '/tmp/'});

const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');



router.post('/upload', upload.single('file'), function(req, res) {
  var file = 'uploads' + '/' + req.file.originalname;
  fs.rename(req.file.path, file, function(err) {
    if (err) {
      res.send(500);
    } else {
      res.json({
        message: 'Flyer correctamente subido',
        filename: req.originalname
      });
    }
  });
});

module.exports = router;
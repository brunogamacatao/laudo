var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Prontuario = mongoose.model('Prontuario');

var csv = require('csv');
var http = require("http");

router.get('/', function(req, res, next) {
  Prontuario.find().sort('-updatedAt').exec(function(err, posts){
    if (err) {
      return next(err);
    }

    res.json(posts);
  });
});

router.post('/', function(req, res, next) {
  var prontuario = new Prontuario(req.body);

  prontuario.save(function(err, post){
    if(err) {
      return next(err);
    }

    res.json(prontuario);
  });
});

router.param('prontuarioId', function(req, res, next, id) {
  var query = Prontuario.findById(id);

  query.exec(function (err, prontuario){
    if (err) { 
      return next(err); 
    }

    if (!prontuario) { 
      return next(new Error('Não foi possível encontrar o prontuario')); 
    }

    req.prontuario = prontuario;
    return next();
  });
});

router.get('/:prontuarioId', function(req, res) {
  res.json(req.prontuario);
});

router.get('/:prontuarioId/delete', function(req, res) {
  req.prontuario.remove().exec();
  res.json({'status': 'ok'});
});

module.exports = router;

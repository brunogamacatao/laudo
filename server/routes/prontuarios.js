var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Laudo = mongoose.model('Laudo');
var Prontuario = mongoose.model('Prontuario');

// Retorna todos os prontuários
router.get('/', function(req, res, next) {
  Prontuario.find().sort('-updatedAt').exec(function(err, posts){
    if (err) {
      return next(err);
    }

    res.json(posts);
  });
});

// Adiciona um prontuário
router.post('/', function(req, res, next) {
  var prontuario = new Prontuario(req.body);

  prontuario.save(function(err, post){
    if(err) {
      return next(err);
    }

    res.json(prontuario);
  });
});

// Retorna um prontuário
router.get('/:prontuarioId', function(req, res) {
  res.json(req.prontuario);
});

// Remove um prontuário
router.get('/:prontuarioId/delete', function(req, res) {
  req.prontuario.remove().exec();
  res.json({'status': 'ok'});
});

// Retorna todos os laudos de um prontuário
router.get('/:prontuarioId/laudos', function(req, res, next) {
  var filter = {'prontuario': req.prontuario};

  Laudo.find(filter).sort('-updatedAt').exec(function(err, laudos){
    if (err) {
      return next(err);
    }

    res.json(laudos);
  });
});

// Retorna um laudo
router.get('/:prontuarioId/laudos/:laudoId', function(req, res) {
  res.json(req.laudo);
});

// Adiciona um laudo a um prontuário
router.post('/:prontuarioId/laudos', function(req, res, next) {
  var laudo = new Laudo(req.body);
  laudo.prontuario = req.prontuario;

  laudo.save(function(err, laudo){
    if(err) {
      return next(err);
    }

    res.json(laudo);
  });
});

// Remove um laudo de um prontuário
router.get('/:prontuarioId/laudos/:laudoId/delete', function(req, res) {
  req.laudo.remove().exec();
  res.json({'status': 'ok'});
});

// Adiciona um prontuário ao request sempre que o parâmetro prontuarioId for informado
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

// Adiciona um laudo ao request sempre que o parâmetro laudoId for informado
router.param('laudoId', function(req, res, next, id) {
  var query = Laudo.findById(id);

  query.exec(function (err, laudo){
    if (err) { 
      return next(err); 
    }

    if (!laudo) { 
      return next(new Error('Não foi possível encontrar o laudo')); 
    }

    req.laudo = laudo;
    return next();
  });
});

module.exports = router;

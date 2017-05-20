var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Laudo = mongoose.model('Laudo');
var Prontuario = mongoose.model('Prontuario');
var Exame = mongoose.model('Exame');

// ----------------------------------------------------------------------------
// PRONTUÁRIOS
// ----------------------------------------------------------------------------

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

  prontuario.owner = req.user;

  prontuario.save(function(err, post){
    if(err) {
      return next(err);
    }

    res.json(prontuario);
  });
});

// Atualiza um prontuário
router.put('/:prontuarioId', function(req, res, next) {
  Prontuario.update({_id: req.prontuario._id}, req.body, {}, function(err, prontuario){
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
router.delete('/:prontuarioId', function(req, res) {
  Prontuario.remove({_id: req.prontuario.id}, function(err) {
    if(err) {
      return next(err);
    }

    res.json({'status': 'ok'});
  });
});

// ----------------------------------------------------------------------------
// LAUDOS
// ----------------------------------------------------------------------------

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
  laudo.user = req.user;

  laudo.save(function(err, laudo){
    if(err) {
      return next(err);
    }

    res.json(laudo);
  });
});

// Remove um laudo de um prontuário
router.delete('/:prontuarioId/laudos/:laudoId', function(req, res) {
  Laudo.remove({_id: req.laudo.id}, function(err) {
    if(err) {
      return next(err);
    }

    res.json({'status': 'ok'});
  });
});

// ----------------------------------------------------------------------------
// EXAMES
// ----------------------------------------------------------------------------

// Retorna todos os exames de um prontuário
router.get('/:prontuarioId/exames', function(req, res, next) {
  var filter = {'prontuario': req.prontuario};

  Exame.find(filter).sort('-updatedAt').exec(function(err, exames){
    if (err) {
      return next(err);
    }

    res.json(exames);
  });
});

// Retorna um exame
router.get('/:prontuarioId/exames/:exameId', function(req, res) {
  res.json(req.exame);
});

// Adiciona um exame a um prontuário
router.post('/:prontuarioId/exames', function(req, res, next) {
  var exame = new Exame(req.body);

  exame.prontuario = req.prontuario;
  exame.user = req.user;

  exame.save(function(err, exame){
    if(err) {
      return next(err);
    }

    res.json(exame);
  });
});

// Atualiza um exame
router.put('/:prontuarioId/exames/:exameId', function(req, res, next) {
  Exame.update({_id: req.exame._id}, req.body, {}, function(err, exame){
    if(err) {
      return next(err);
    }

    res.json(exame);
  });
});

// Remove um laudo de um prontuário
router.delete('/:prontuarioId/exames/:exameId', function(req, res) {
  Exame.remove({_id: req.exame.id}, function(err) {
    if(err) {
      return next(err);
    }

    res.json({'status': 'ok'});
  });
});

// ----------------------------------------------------------------------------
// REQUEST PARAMETERS
// ----------------------------------------------------------------------------

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

// Adiciona um exame ao request sempre que o parâmetro exameId for informado
router.param('exameId', function(req, res, next, id) {
  var query = Exame.findById(id);

  query.exec(function (err, exame){
    if (err) { 
      return next(err); 
    }

    if (!exame) { 
      return next(new Error('Não foi possível encontrar o exame')); 
    }

    req.exame = exame;
    return next();
  });
});


module.exports = router;

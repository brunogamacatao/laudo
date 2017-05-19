var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Laudo = mongoose.model('Laudo');
var Prontuario = mongoose.model('Prontuario');

router.get('/', function(req, res, next) {
  var filter = null;

  if (!req.user.admin) {
    filter = {'owner': req.user};
  }

  Laudo.find(filter).sort('-updatedAt').populate('owner').exec(function(err, posts){
    if (err) {
      return next(err);
    }

    res.json(posts);
  });
});

router.post('/', function(req, res, next) {
  var laudo = new Laudo(req.body);
  laudo.owner = req.user;

  laudo.save(function(err, post){
    if(err) {
      return next(err);
    }

    res.json(laudo);
  });
});

router.param('prontuarioId', function(req, res, next, id) {
  var query = Prontuario.findById(id);

  query.exec(function (err, prontuario){
    if (err) { 
      return next(err); 
    }

    if (!prontuario) { 
      return next(new Error('Não foi possível encontrar o prontuário')); 
    }

    req.prontuario = prontuario;
    return next();
  });
});


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

router.get('/:laudoId', function(req, res) {
  res.json(req.laudo);
});

router.get('/:laudoId/delete', function(req, res) {
  req.laudo.remove().exec();
  res.json({'status': 'ok'});
});

module.exports = router;

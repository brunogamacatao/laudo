import express from 'express';
import mongoose from 'mongoose';
import { token } from '../aplicacao'

var router = express.Router();
var Laudo = mongoose.model('Laudo');
var Prontuario = mongoose.model('Prontuario');
var Exame = mongoose.model('Exame');
var GMFM = mongoose.model('GMFM');
var Questionario = mongoose.model('Questionario');
var Antropometria = mongoose.model('Antropometria');

// ----------------------------------------------------------------------------
// PRONTUÁRIOS
// ----------------------------------------------------------------------------

// Retorna todos os prontuários
router.get('/', token({ required: true }), function(req, res, next) {
  var createSearchRegex = () => (new RegExp(req.query.search, 'i'));

  var query = !req.query.search ? {} : {
    $or: [
      {'mae.nome': createSearchRegex()},
      {'mae.cidade': createSearchRegex()},
      {'crianca.nome': createSearchRegex()},
      {'crianca.maFormacao': createSearchRegex()}
    ]
  };

  var sort = {'updatedAt': -1};

  if (req.query.hasOwnProperty('sort')) {
    sort = {};
    sort[req.query.sort] = 1;
    sort['updatedAt'] = -1;
  }

  var options = {
    limit: 9999999
  };

  if (req.query.hasOwnProperty('offset') && req.query.hasOwnProperty('limit')) {
    options = {
      offset: parseInt(req.query.offset),
      limit: parseInt(req.query.limit),
      sort: sort
    };
  }

  Prontuario.paginate(query, options, function(err, result){
    if (err) {
      return next(err);
    }

    res.json(result);
  });
});

// Retorna a quantidade de prontuários
router.get('/count', token({ required: true }), function(req, res, next) {
  Prontuario.count({}, function(err, count){
    if (err) {
      return next(err);
    }

    res.json({count});
  });
});

// Retorna todos os laudos
router.get('/laudos', function(req, res, next) {
  Laudo.find().sort('-updatedAt').populate('prontuario').populate('owner').exec(function(err, laudos){
    if (err) {
      return next(err);
    }

    res.json(laudos);
  });
});
// Retorna todos os exames
router.get('/exames', function(req, res, next) {
  Exame.find().sort('-updatedAt').populate('prontuario').populate('owner').exec(function(err, exames){
    if (err) {
      return next(err);
    }

    res.json(exames);
  });
});
// Retorna todos os gmfm
router.get('/gmfms', function(req, res, next) {
  GMFM.find().sort('-updatedAt').populate('prontuario').populate('owner').exec(function(err, gmfms){
    if (err) {
      return next(err);
    }

    res.json(gmfms);
  });
});
// Retorna todos os questionarios
router.get('/questionarios', function(req, res, next) {
  Questionario.find().sort('-updatedAt').populate('prontuario').populate('owner').exec(function(err, dados){
    if (err) {
      return next(err);
    }

    res.json(dados);
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

// Remove um exame de um prontuário
router.delete('/:prontuarioId/exames/:exameId', function(req, res) {
  Exame.remove({_id: req.exame.id}, function(err) {
    if(err) {
      return next(err);
    }

    res.json({'status': 'ok'});
  });
});

// ----------------------------------------------------------------------------
// GMFM
// ----------------------------------------------------------------------------

// Retorna todos os gmfm de um prontuário
router.get('/:prontuarioId/gmfms', function(req, res, next) {
  var filter = {'prontuario': req.prontuario};

  GMFM.find(filter).sort('-updatedAt').exec(function(err, gmfms){
    if (err) {
      return next(err);
    }

    res.json(gmfms);
  });
});

// Retorna um gmfm
router.get('/:prontuarioId/gmfms/:gmfmId', function(req, res) {
  res.json(req.gmfm);
});

// Adiciona um gmfm a um prontuário
router.post('/:prontuarioId/gmfms', function(req, res, next) {
  var gmfm = new GMFM(req.body);

  gmfm.prontuario = req.prontuario;
  gmfm.user = req.user;

  gmfm.save(function(err, gmfm){
    if(err) {
      return next(err);
    }

    res.json(gmfm);
  });
});

// Atualiza um gmfm
router.put('/:prontuarioId/gmfms/:gmfmId', function(req, res, next) {
  GMFM.update({_id: req.gmfm._id}, req.body, {}, function(err, gmfm){
    if(err) {
      return next(err);
    }

    res.json(gmfm);
  });
});

// Remove um gmfm de um prontuário
router.delete('/:prontuarioId/gmfms/:gmfmId', function(req, res) {
  GMFM.remove({_id: req.gmfm.id}, function(err) {
    if(err) {
      return next(err);
    }

    res.json({'status': 'ok'});
  });
});

// ----------------------------------------------------------------------------
// Antropometria
// ----------------------------------------------------------------------------

// Retorna todas as antropometrias de um prontuário
router.get('/:prontuarioId/antropometrias', function(req, res, next) {
  var filter = {'prontuario': req.prontuario};

  Antropometria.find(filter).sort('-updatedAt').exec(function(err, antropometrias){
    if (err) {
      return next(err);
    }

    res.json(antropometrias);
  });
});

// Retorna uma antropometria
router.get('/:prontuarioId/antropometrias/:antropometriaId', function(req, res) {
  res.json(req.antropometria);
});

// Adiciona uma antropometria a um prontuário
router.post('/:prontuarioId/antropometrias', function(req, res, next) {
  var antropometria = new Antropometria(req.body);

  antropometria.prontuario = req.prontuario;
  antropometria.user = req.user;

  antropometria.save(function(err, antropometria){
    if(err) {
      return next(err);
    }

    res.json(antropometria);
  });
});

// Atualiza uma antropometria
router.put('/:prontuarioId/antropometrias/:antropometriaId', function(req, res, next) {
  Antropometria.update({_id: req.antropometria._id}, req.body, {}, function(err, antropometria){
    if(err) {
      return next(err);
    }

    res.json(antropometria);
  });
});

// Remove uma antropometria de um prontuário
router.delete('/:prontuarioId/antropometrias/:antropometriaId', function(req, res) {
  Antropometria.remove({_id: req.antropometria.id}, function(err) {
    if(err) {
      return next(err);
    }

    res.json({'status': 'ok'});
  });
});

// ----------------------------------------------------------------------------
// QUESTIONÁRIOS
// ----------------------------------------------------------------------------
// Retorna todos os questionários de um prontuário
router.get('/:prontuarioId/questionarios', function(req, res, next) {
  var filter = {'prontuario': req.prontuario};

  Questionario.find(filter)
    .sort('-updatedAt')
    .populate('prontuario')
    .populate('owner')
    .exec(function(err, data) {
    if (err) {
      return next(err);
    }

    res.json(data);
  });
});

// Adiciona um questionário
router.post('/:prontuarioId/questionarios', function(req, res, next) {
  var q = new Questionario(req.body);

  q.owner = req.user;
  q.prontuario = req.prontuario;

  q.save(function(err, post){
    if(err) {
      return next(err);
    }

    res.json(q);
  });
});

// Atualiza um questionário
router.put('/:prontuarioId/questionarios/:questionarioId', function(req, res, next) {
  Questionario.update({_id: req.questionario._id}, req.body, {}, function(err, questionario){
    if(err) {
      return next(err);
    }

    res.json(questionario);
  });
});

// Retorna um prontuário
router.get('/:prontuarioId/questionarios/:questionarioId', function(req, res) {
  res.json(req.questionario);
});

// Remove um prontuário
router.delete('/:prontuarioId/questionarios/:questionarioId', function(req, res) {
  Questionario.remove({_id: req.questionario.id}, function(err) {
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

// Adiciona um gmfm ao request sempre que o parâmetro gmfmId for informado
router.param('gmfmId', function(req, res, next, id) {
  var query = GMFM.findById(id);

  query.exec(function (err, gmfm){
    if (err) { 
      return next(err); 
    }

    if (!gmfm) { 
      return next(new Error('Não foi possível encontrar o gmfm')); 
    }

    req.gmfm = gmfm;
    return next();
  });
});

// Adiciona um questionário ao request sempre que o parâmetro questionarioId for informado
router.param('questionarioId', function(req, res, next, id) {
  var query = Questionario.findById(id);

  query.exec(function (err, questionario){
    if (err) { 
      return next(err); 
    }

    if (!questionario) { 
      return next(new Error('Não foi possível encontrar o questionário')); 
    }

    req.questionario = questionario;
    return next();
  });
});


module.exports = router;

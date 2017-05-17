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

router.get('/migracao', function(req, res, next) {
  var url = 'http://localhost:3000/dados/dados.csv';

  if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    url = 'https://laudozikv.herokuapp.com/dados/dados.csv';
  }
  
  http.get(url, function(response) {
    response.pipe(csv.parse({
      columns: true,
      delimiter: ';'
    }))
    .pipe(csv.transform(function(r) {
      new Prontuario({
        mae: {
          nome: r.nome_mae,
          localAcompanhamento: r.local_acompanhamento,
          endereco: r.endereco,
          cidade: r.cidade,
          pontoDeReferencia: r.ponto_referencia,
          telefone: r.telefone_mae,
          telefoneContato: r.telefone_contato,
          dataDeNascimento: r.data_nascimento,
          gestacoes: r.gestacoes,
          nascimentos: r.nascimento,
          abortos: r.abortos,
          peso: r.peso_mae,
          altura: r.altura_mae,
          primeiraUltrassom: r.primeira_ultrason,
          ultimaUltrassom: r.ultima_ultrason,
          idadeGestacionalAdmissaoProjeto: r.idade_gestacional_admissao_projeto,          
          enxatema: {
            historiaEnxatema: r.historia_exantema === 'Sim',
            trimestre: r.trimestre_exantema,
            mes: r.mes_exantema,
            idadeGestacionalEnxatemaMes: r.idade_gestacional_exatema_mes,
            idadeGestacionalEnxatemaTrimestre: r.idade_gestacional_exatema_trimestre
          }
        },
        crianca: {
          nome: r.nome_crianca,
          dataDeNascimento: r.nascimento_crianca,
          tipoDeParto: r.tipo_parto,
          idadeGestacionalParto: r.idade_gestacional_parto,
          condicaoNascimento: r.condicao_nascimento,
          maFormacao: r.ma_formacao,
          peso: r.peso_crianca,
          estatura: r.estatura,
          pc: r.pc,
          apgar1M: r.apgar_primeiro_minuto,
          apgar5M: r.apgar_quinto_minuto
        }
      }).save();
    }));
  });

  res.json({ok: true});
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

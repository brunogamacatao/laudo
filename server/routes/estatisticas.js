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

router.get('/', token({ required: false }), function(req, res, next) {
  let operacoes = {};

  function criaChave(data) {
    return new Date(data.getYear(), data.getMonth(), data.getDate());
  }

  function guarda(entidade) {
    let chave1 = criaChave(entidade.createdAt);
    let chave2 = criaChave(entidade.updatedAt);

    if (chave1.getTime() != chave2.getTime()) {
      operacoes[chave1] = (chave1 in operacoes) ? 1 + operacoes[chave1] : 1;
      operacoes[chave2] = (chave2 in operacoes) ? 1 + operacoes[chave2] : 1;
    } else {
      operacoes[chave1] = (chave1 in operacoes) ? 1 + operacoes[chave1] : 1;
    }
  }

  Prontuario.find().exec(function(err, prontuarios) {
    prontuarios.forEach(guarda);
    Questionario.find().exec(function(err, questionarios) {
      questionarios.forEach(guarda);
      Laudo.find().exec(function(err, laudos) {
        laudos.forEach(guarda);
        res.json(operacoes);
      });
    });
  });  
});

module.exports = router;
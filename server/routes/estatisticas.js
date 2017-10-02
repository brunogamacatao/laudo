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

router.get('/cidades', token({ required: false }), function(req, res, next) {
  let cidades = {};

  if (!String.prototype.trim) {
    (function() {
      // Make sure we trim BOM and NBSP
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      String.prototype.trim = function() {
        return this.replace(rtrim, '');
      };
    })();
  }  

  Prontuario.find().exec(function(err, prontuarios) {
    // Agrupa os prontuários pela cidade
    prontuarios.forEach((p) => {
      let cidade = p.mae.cidade;

      // Normaliza o nome da cidade para evitar duplicações
      cidade = cidade.toUpperCase();

      if (cidade.indexOf('-') >= 0) {
        cidade = cidade.split('-')[0];
      }

      if (cidade.indexOf('/') >= 0) {
        cidade = cidade.split('-')[0];
      }

      cidade = cidade.trim();

      if (cidade.length === 0) {
        cidade = 'NÃO INFORMADA';
      }

      cidades[cidade] = (cidade in cidades) ? cidades[cidade] + 1 : 1;
    });

    // Cria uma lista a partir das cidades agrupadas
    let cidadesLista = [];

    for (let cidade in cidades) {
      cidadesLista.push({
        'Cidade': cidade,
        'Prontuarios': cidades[cidade]
      });
    }

    // Ordena as cidades pela quantidade de prontuários
    cidadesLista.sort((c1, c2) => {
      return c2['Prontuarios'] - c1['Prontuarios'];
    });

    // Mantém apenas as 10 mais, todas as outras serão agrupadas em outros
    if (cidadesLista.length > 10) {
      let total = 0;

      for (let i = 10; i < cidadesLista.length; i++) {
        total += cidadesLista[i]['Prontuarios'];
      }

      cidadesLista.splice(10, cidadesLista.length - 10);
      cidadesLista.push({
        'Cidade': 'Outras',
        'Prontuarios': total
      });
    }

    res.json(cidadesLista);
  });
});

router.get('/malformacoes', token({ required: false }), function(req, res, next) {
  let malformacoes = {
    'aparelhoCirculatorio': {qtd: 0, texto: 'Circulatório'},
    'aparelhoRespiratorio': {qtd: 0, texto: 'Respiratório'},
    'aparelhoDigestivo': {qtd: 0, texto: 'Digestório'},
    'orgaosGenitais': {qtd: 0, texto: 'Genital'},
    'aparelhoOsteomuscular': {qtd: 0, texto: 'Osteomolecular'},
    'descricao': {qtd: 0, texto: 'Outras'}
  };

  let chaves = [
    'aparelhoCirculatorio',
    'aparelhoRespiratorio',
    'aparelhoDigestivo',
    'orgaosGenitais',
    'aparelhoOsteomuscular',
    'descricao'
  ];

  Questionario.find().exec(function(err, questionarios) {
    questionarios.forEach((q) => {
      chaves.forEach((c) => {
        if (q.recemNascido.malformacoes[c]) {
          malformacoes[c].qtd++;
        }
      });
    });

    let malformacoesLista = [];
    for (let k in malformacoes) {
      malformacoesLista.push({
        'Malformacao': malformacoes[k].texto,
        'Quantidade': malformacoes[k].qtd
      });
    }

    res.json(malformacoesLista);
  });
});

module.exports = router;
var mongoose = require('mongoose');

var MaterialColetadoSchema = new mongoose.Schema({
  sa: Boolean,
  ur: Boolean,
  la: Boolean,
  lcr: Boolean
});

var DadosConclusaoSchema = new mongoose.Schema({
  positivo: Boolean,
  sg: Boolean,
  ur: Boolean,
  la: Boolean,
  lcr: Boolean
});


var ConclusaoSchema = new mongoose.Schema({
  zikv: DadosConclusaoSchema,
  chikv: DadosConclusaoSchema
});

var LaudoSchema = new mongoose.Schema({
  nome: String,
  dataInicioSintomas: Date,
  dataColeta: Date,
  dataResultado: Date,
  materialColetado: MaterialColetadoSchema,
  metodologia: String,
  resultado: String,
  conclusao: ConclusaoSchema,
  assinatura: String
});

mongoose.model('Laudo', LaudoSchema);

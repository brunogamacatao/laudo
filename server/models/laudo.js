var mongoose = require('mongoose');

var MaterialColetadoSchema = new mongoose.Schema({
  sa: Boolean,
  ur: Boolean,
  la: Boolean,
  lcr: Boolean
});

var SintomasSchema = new mongoose.Schema({
  febre: Boolean,
  dorDeCabeca: Boolean,
  exantema: Boolean,
  conjuntivite: Boolean,
  dorCorpo: Boolean,
  dorRetroOrbital: Boolean,
  dorArticulacoes: Boolean
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
  chikv: DadosConclusaoSchema,
  sifilis: DadosConclusaoSchema,
  rubeola: DadosConclusaoSchema,
  toxoplasmose: DadosConclusaoSchema,
  citomegalovirus: DadosConclusaoSchema,
  herpes: DadosConclusaoSchema,
  dengue: DadosConclusaoSchema
});

var LaudoSchema = new mongoose.Schema({
  nome: String,
  referente: String,
  dataInicioSintomas: Date,
  dataColeta: Date,
  dataResultado: Date,
  materialColetado: MaterialColetadoSchema,
  sintomas: SintomasSchema,
  metodologia: String,
  resultado: String,
  conclusao: ConclusaoSchema,
  assinatura: String,
  notas: String,
  createdAt: Date,
  updatedAt: Date,
  prontuario: {
    type: mongoose.Schema.ObjectId,
    ref: 'Prontuario'
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }  
});

LaudoSchema.pre('save', function(next) {
  var now = new Date();

  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

mongoose.model('Laudo', LaudoSchema);
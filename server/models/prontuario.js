var mongoose = require('mongoose');

var EnxatemaSchema = new mongoose.Schema({
  historiaEnxatema: Boolean,
  trimestre: String,
  mes: String,
  idadeGestacionalEnxatemaMes: String,
  idadeGestacionalEnxatemaTrimestre: String
});

var MaeSchema = new mongoose.Schema({
  nome: String,
  localAcompanhamento: String,
  endereco: String,
  cidade: String,
  pontoDeReferencia: String,
  telefone: String,
  telefoneContato: String,
  dataDeNascimento: String,
  gestacoes: Number,
  nascimentos: Number,
  abortos: Number,
  peso: Number,
  altura: Number,
  primeiraUltrassom: String,
  ultimaUltrassom: String,
  idadeGestacionalAdmissaoProjeto: String,
  enxatema: EnxatemaSchema
});

var CriancaSchema = new mongoose.Schema({
  nome: String,
  dataDeNascimento: String,
  tipoDeParto: String,
  idadeGestacionalParto: Number,
  condicaoNascimento: String,
  maFormacao: String,
  peso: Number,
  estatura: Number,
  pc: String,
  apgar1M: Number,
  apgar5M: Number
});

var ProntuarioSchema = new mongoose.Schema({
  mae: MaeSchema,
  crianca: CriancaSchema,
  createdAt: Date,
  updatedAt: Date,
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

ProntuarioSchema.pre('save', function(next) {
  var now = new Date();

  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

mongoose.model('Prontuario', ProntuarioSchema);

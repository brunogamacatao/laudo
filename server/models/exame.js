var mongoose = require('mongoose');

var ExameSchema = new mongoose.Schema({
  nome: String,
  data: Date,
  idadeGestacional: Number,
  local: String,
  imagemSalva: Boolean,
  reducaoVolumetrica: Boolean,
  paquigiria: Boolean,
  lisencefalia: Boolean,
  ventriculomegalia: Boolean,
  hidrocefalia: Boolean,
  ventriculomegaliaSevera: Boolean,
  calcificacoes: Boolean,
  localDasCalcificacoes: String,
  corpoCaloso: String,
  malformacoesCisticas: Boolean,
  localCistos: String,
  hipoplasiaDoCerebelo: Boolean,
  hipoplasiaDoVermis: Boolean,
  hipoplasiaDoTronco: Boolean,
  hipoplasiaDaPonte: Boolean,
  hipoPlasiaDoHipotalamo: Boolean,
  reducaoDasFontanelas: Boolean,
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

ExameSchema.pre('save', function(next) {
  var now = new Date();

  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

mongoose.model('Exame', ExameSchema);
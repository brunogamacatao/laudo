var mongoose = require('mongoose');

var AntropometriaSchema = new mongoose.Schema({
  data: Date,
  meses: Number,
  usg: Number,
  peso: Number,
  perimetroCraniano: Number,
  circunferenciaAbdominal: Number,
  perimetroToracico: Number,
  pregaTricipital: Number,
  pregaSubescapular: Number,
  estatura: Number,
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

AntropometriaSchema.pre('save', function(next) {
  var now = new Date();

  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

mongoose.model('Antropometria', AntropometriaSchema);
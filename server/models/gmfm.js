var mongoose = require('mongoose');

var GMFMSchema = new mongoose.Schema({
  data: Date,
  nivelI: Number,
  nivelII: Number,
  nivelIII: Number,
  nivelIV: Number,
  nivelV: Number,
  score88: Number,
  dimensaoA: Number,
  dimensaoB: Number,
  dimensaoC: Number,
  dimensaoD: Number,
  dimensaoE: Number,
  score66: Number,
  erroPadrao: Number,
  indiceDeConfianca: Number,
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

GMFMSchema.pre('save', function(next) {
  var now = new Date();

  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

mongoose.model('GMFM', GMFMSchema);
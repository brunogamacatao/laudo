var mongoose = require('mongoose');
var constantes = require('./config/constantes');

var BancoDeDados = function(callback) {
  mongoose.connect(constantes.DATABASE_URL);

  var db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    this.registraModelos();
    callback();
  }.bind(this));
};

BancoDeDados.prototype.registraModelos = function() {
  require('./models/user');
  require('./models/laudo');
  require('./models/prontuario');
  require('./models/exame');
  require('./models/gmfm');
  require('./models/antropometria');
  require('./models/questionario');
};

module.exports = BancoDeDados;
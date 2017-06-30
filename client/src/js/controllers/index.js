import angular from 'angular';
import '../services';

// Cria o módulo
const controllers = angular.module('ipesq.controllers', ['ipesq.services']);

// Importa os controladores
require('./principal');
require('./security');
require('./exame');
require('./exportar');
require('./gmfm');
require('./antropometria');
require('./laudo');
require('./prontuario');
require('./questionario');

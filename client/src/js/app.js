// Importa polyfills para browsers antigos
import 'promise-polyfill';
import 'whatwg-fetch';

// Importa o angular
import angular from 'angular';

// Importa plugins do angular
import 'angular-ui-router';
import 'angular-messages';
import 'angular-sanitize';

// Importa o jQuery
import 'jquery';

// Importa o livereload
import LiveReload from './util/livereload';

// Importa as folhas de estilo
require('bootstrap-webpack');
require('../css/style.css');

// Importa os componentes
import './controllers';
import './directives';
import './services';
import setupRoutes from './routes';

// Inicia o live reload (sempre que o código mudar, o browser é recarregado)
LiveReload.start();

const app = angular.module('ipesq', 
  ['ui.router', 'ngSanitize', 'ipesq.controllers', 'ipesq.directives', 'ipesq.services']);

// Configuração das rotas
app.config(
  ['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      setupRoutes($stateProvider, $urlRouterProvider);
    }
  ]
);
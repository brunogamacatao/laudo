// Importa o angular
import angular from 'angular';

// Importa plugins do angular
import 'angular-ui-router';
import 'angular-messages';
import 'angular-sanitize';

// Importa o bootstrap
import 'jquery';
import 'bootstrap-webpack';

// Importa o livereload
import LiveReload from './util/livereload';

// Importa as folhas de estilo
import '../css/style.css';

// Importa os componentes
import './controllers';
import './directives';
import setupRoutes from './routes';

// Inicia o live reload (sempre que o código mudar, o browser é recarregado)
LiveReload.start();

const app = angular.module('ipesq', 
  ['ui.router', 'ngSanitize', 'ipesq.controllers', 'ipesq.directives']);

// Configuração das rotas
app.config(
  ['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      setupRoutes($stateProvider, $urlRouterProvider);
    }
  ]
);
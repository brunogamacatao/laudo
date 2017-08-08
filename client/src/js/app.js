// Importa polyfills para browsers antigos
import 'promise-polyfill';
import 'whatwg-fetch';

// Importa o angular
import angular from 'angular';

// Importa plugins do angular
import 'angular-ui-router';
import 'angular-messages';
import 'angular-sanitize';
import 'angular-resource';

// Importa o jQuery
import 'jquery';

// Importa o livereload
import LiveReload from './util/livereload';

// Importa o FilePicker
import 'filepicker-js';
import 'angular-filepicker/dist/angular_filepicker';

// Importa as folhas de estilo
require('bootstrap-webpack');
require('../css/style.css');

// Importa os componentes
import './controllers';
import './directives';
import './components';
import './services';
import setupRoutes from './routes';

// Inicia o live reload (sempre que o código mudar, o browser é recarregado)
LiveReload.start();

const app = angular.module('ipesq', 
  ['ui.router', 'ngResource', 'ngSanitize', 'angular-filepicker', 
   'ipesq.controllers', 'ipesq.directives', 'ipesq.components', 
   'ipesq.services']);

// Configuração das rotas
app.config(
  ['$stateProvider', '$urlRouterProvider', 'filepickerProvider',
    function($stateProvider, $urlRouterProvider, filepickerProvider) {
      setupRoutes($stateProvider, $urlRouterProvider);

      const FILEPICKER_API_KEY    = 'Aide40CT9QwyIdqDDksEfz';
      const FILEPICKER_API_SECRET = 'RMXVVVF74RG7HKJ57BW66PUOS4';

      filepickerProvider.setKey(FILEPICKER_API_KEY);
    }
  ]
);

app.run(['$rootScope', '$state', 'AuthService', function ($rootScope, $state, AuthService) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    if (toState.authenticate) {
      function handleLogout() {
        AuthService.setUserStatus(false);
        $rootScope.$emit('logout');
        $state.transitionTo('login');
        event.preventDefault();        
      }

      AuthService.getUserStatus().then(function success(data) {
        if (data.data.status) {
          AuthService.setUserStatus(true);
          AuthService.setToken(data.data.token);
          $rootScope.$emit('login');
        } else {
          handleLogout();
        }
      }, handleLogout);
    }
  });
}]);
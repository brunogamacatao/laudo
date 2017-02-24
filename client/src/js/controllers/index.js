import angular from 'angular';
import PrintToPdf from '../util/print';
import '../services';

// Cria o módulo
const controllers = angular.module('ipesq.controllers', ['ipesq.services']);

// Cria os controladores
controllers.controller('MainController', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
  function novoLaudo() {
    return {
      dataResultado: new Date(),
      materialColetado: {},
      resultado: null,
      conclusao: {
        zikv: {},
        chikv: {}
      }
    };
  }

  if ($stateParams.id) {
    $http.get('/laudos/' + $stateParams.id).then(function(retorno) {
      // Conversão das datas
      if (retorno.data.dataInicioSintomas) {
        retorno.data.dataInicioSintomas = new Date(retorno.data.dataInicioSintomas);
      }

      if (retorno.data.dataColeta) {
        retorno.data.dataColeta = new Date(retorno.data.dataColeta);
      }

      if (retorno.data.dataResultado) {
        retorno.data.dataResultado = new Date(retorno.data.dataResultado);
      }

      $scope.laudo = retorno.data;

    });
  } else {
    $scope.laudo = novoLaudo();
  }

  $scope.emitir = function() {

    if ($scope.laudo._id) {
      console.log('Imprimindo ...');
      new PrintToPdf($scope.laudo).print();
    } else {
      console.log('Salvando ...');
      $http.post('/laudos', $scope.laudo).then(function() {
        console.log('Pronto');
        new PrintToPdf($scope.laudo).print();
      }, function(error) {
        console.log('Deu erro');
      });
    }
  };

  $scope.limpar = function() {
    $scope.laudo = novoLaudo();
  };
}]);

controllers.controller('ListaController', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $scope.laudos = [];

  function carregaLaudos() {
    $http.get('/laudos').then(function(retorno) {
      $scope.laudos = retorno.data;
    }, function(error) {
      console.log('Deu erro');
    });
  }

  carregaLaudos();

  $scope.detalhe = function(laudo) {
    $state.go('editar', {id: laudo._id});
  };

  $scope.excluir = function(laudo) {
    $http.get('/laudos/' + laudo._id + '/delete').then(function(retorno) {
      carregaLaudos();
    });
  };
}]);

controllers.controller('LoginController',
  ['$scope', '$rootScope', '$state', 'AuthService',
  function ($scope, $rootScope, $state, AuthService) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $rootScope.$emit('login');
          $state.go('index');          
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $rootScope.$emit('logout');
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });
    };
}]);

controllers.controller('LogoutController',
  ['$scope', '$rootScope', '$state', 'AuthService',
  function ($scope, $rootScope, $state, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $rootScope.$emit('logout');
          $state.go('login');
        });
    };

    $scope.logout();
}]);


controllers.controller('RegisterController',
  ['$scope', '$state', 'AuthService',
  function ($scope, $state, AuthService) {

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function success() {
          $state.go('login');
          $scope.disabled = false;
          $scope.registerForm = {};
        }, function error() {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };
}]);

controllers.controller('NavbarController', 
  ['$scope', '$rootScope', '$state', 'AuthService',
  function ($scope, $rootScope, $state, AuthService) {
    $scope.isLoggedIn = AuthService.isLoggedIn();

    $rootScope.$on('login', function() {
      $scope.isLoggedIn = AuthService.isLoggedIn();
    });

    $rootScope.$on('logout', function() {
      $scope.isLoggedIn = AuthService.isLoggedIn();
    });
}]);
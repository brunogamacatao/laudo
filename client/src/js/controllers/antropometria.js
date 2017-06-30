import angular from 'angular';

const controllers = angular.module('ipesq.controllers');

controllers.controller('NovoAntropometriaController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'novo_antropometria';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.antropometria = {};

    $scope.salvar = function() {
      $http.post('/prontuarios/' + $scope.id_prontuario + '/antropometrias', $scope.antropometria).then(function() {
        console.log('Pronto');
        $state.go('listar_antropometrias', {id_prontuario: $scope.id_prontuario});
      }, function(error) {
        console.log('Deu erro');
      });
    };
  }
]);

controllers.controller('EditarAntropometriaController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'editar_antropometria';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.antropometria = {};

    $http.get('/prontuarios/' + $stateParams.id_prontuario + '/antropometrias/' + $stateParams.id_antropometria).then(function(retorno) {
      // Conversão das datas
      if (retorno.data.data) {
        retorno.data.data = new Date(retorno.data.data);
      }

      $scope.antropometria = retorno.data;
    });

    $scope.salvar = function() {
      $http.put('/prontuarios/' + $scope.id_prontuario + '/antropometrias/' + $stateParams.id_antropometria, $scope.antropometria).then(function() {
        console.log('Pronto');
        $state.go('listar_antropometrias', {id_prontuario: $scope.id_prontuario});
      }, function(error) {
        console.log('Deu erro');
      });
    };
  }
]);

controllers.controller('ListarAntropometriasController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'listar_antropometrias';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.antropometrias = [];

    function carrega() {
      $http.get('/prontuarios/' + $scope.id_prontuario + '/antropometrias').then(function(retorno) {
        $scope.antropometrias = retorno.data;
      }, function(error) {
        console.log('Deu erro');
      });
    }

    carrega();
    
    $scope.detalhe = function(antropometria) {
      $state.go('editar_antropometria', {id_antropometria: antropometria._id, id_prontuario: $scope.id_prontuario});
    };

    $scope.excluir = function(antropometria) {
      $scope.antropometriaParaExcluir = antropometria;
      $('#modal_excluir_antropometria').modal('show');
    };

    $scope.confirmaExcluir = function() {
      $('#modal_excluir_antropometria').modal('hide');
      $http.delete('/prontuarios/' + $scope.id_prontuario + '/antropometrias/' + $scope.antropometriaParaExcluir._id).then(function(retorno) {
        carrega();
      });
    };
  }
]);
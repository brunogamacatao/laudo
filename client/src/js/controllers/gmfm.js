import angular from 'angular';

const controllers = angular.module('ipesq.controllers');

controllers.controller('NovoGMFMController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'novo_gmfm';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.gmfm = {};

    $scope.salvar = function() {
      $http.post('/prontuarios/' + $scope.id_prontuario + '/gmfms', $scope.gmfm).then(function() {
        console.log('Pronto');
        $state.go('listar_gmfms', {id_prontuario: $scope.id_prontuario});
      }, function(error) {
        console.log('Deu erro');
      });
    };
  }
]);

controllers.controller('EditarGMFMController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'editar_gmfm';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.gmfm = {};

    $http.get('/prontuarios/' + $stateParams.id_prontuario + '/gmfms/' + $stateParams.id_gmfm).then(function(retorno) {
      // Conversão das datas
      if (retorno.data.data) {
        retorno.data.data = new Date(retorno.data.data);
      }

      $scope.gmfm = retorno.data;
    });

    $scope.salvar = function() {
      $http.put('/prontuarios/' + $scope.id_prontuario + '/gmfms/' + $stateParams.id_gmfm, $scope.gmfm).then(function() {
        console.log('Pronto');
        $state.go('listar_gmfms', {id_prontuario: $scope.id_prontuario});
      }, function(error) {
        console.log('Deu erro');
      });
    };
  }
]);

controllers.controller('ListarGMFMSController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'listar_gmfms';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.gmfms = [];

    function carrega() {
      $http.get('/prontuarios/' + $scope.id_prontuario + '/gmfms').then(function(retorno) {
        $scope.gmfms = retorno.data;
      }, function(error) {
        console.log('Deu erro');
      });
    }

    carrega();
    
    $scope.detalhe = function(gmfm) {
      $state.go('editar_gmfm', {id_gmfm: gmfm._id, id_prontuario: $scope.id_prontuario});
    };

    $scope.excluir = function(gmfm) {
      $scope.gmfmParaExcluir = gmfm;
      $('#modal_excluir_gmfm').modal('show');
    };

    $scope.confirmaExcluir = function() {
      $('#modal_excluir_gmfm').modal('hide');
      $http.delete('/prontuarios/' + $scope.id_prontuario + '/gmfms/' + $scope.gmfmParaExcluir._id).then(function(retorno) {
        carrega();
      });
    };
  }
]);
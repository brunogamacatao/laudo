import angular from 'angular';

const controllers = angular.module('ipesq.controllers');

controllers.controller('NovoExameController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'novo_exame';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.exame = {};
    $scope.unidade = '';

    $scope.salvar = function() {
      $http.post('/prontuarios/' + $scope.id_prontuario + '/exames', $scope.exame).then(function() {
        console.log('Pronto');
        $state.go('listar_exames', {id_prontuario: $scope.id_prontuario});
      }, function(error) {
        console.log('Deu erro');
      });
    };

    $scope.mudaUnidade = function() {
      var unidades = ['', 'semanas', 'dias', 'meses', 'dias'];
      $scope.unidade = unidades[parseInt($('#nome_exame_select').prop('selectedIndex'))];
    }
  }
]);

controllers.controller('EditarExameController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'editar_exame';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.exame = {};
    $scope.unidade = '';

    $http.get('/prontuarios/' + $stateParams.id_prontuario + '/exames/' + $stateParams.id_exame).then(function(retorno) {
      // Conversão das datas
      if (retorno.data.data) {
        retorno.data.data = new Date(retorno.data.data);
      }

      $scope.exame = retorno.data;
    });

    $scope.salvar = function() {
      $http.put('/prontuarios/' + $scope.id_prontuario + '/exames/' + $stateParams.id_exame, $scope.exame).then(function() {
        console.log('Pronto');
        $state.go('listar_exames', {id_prontuario: $scope.id_prontuario});
      }, function(error) {
        console.log('Deu erro');
      });
    };

    $scope.mudaUnidade = function() {
      var unidades = ['', 'semanas', 'dias', 'meses', 'dias'];
      $scope.unidade = unidades[parseInt($('#nome_exame_select').prop('selectedIndex'))];
    }

  }
]);

controllers.controller('ListarExamesController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'listar_exames';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.exames = [];

    function carregaExames() {
      $http.get('/prontuarios/' + $scope.id_prontuario + '/exames').then(function(retorno) {
        $scope.exames = retorno.data;
      }, function(error) {
        console.log('Deu erro');
      });
    }

    carregaExames();
    
    $scope.detalhe = function(exame) {
      $state.go('editar_exame', {id_exame: exame._id, id_prontuario: $scope.id_prontuario});
    };

    $scope.excluir = function(exame) {
      $scope.exameParaExcluir = exame;
      $('#modal_excluir_exame').modal('show');
    };

    $scope.confirmaExcluir = function() {
      $('#modal_excluir_exame').modal('hide');
      $http.delete('/prontuarios/' + $scope.id_prontuario + '/exames/' + $scope.exameParaExcluir._id).then(function(retorno) {
        carregaExames();
      });
    };
  }
]);
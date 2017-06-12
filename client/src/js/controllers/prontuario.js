import angular from 'angular';

const controllers = angular.module('ipesq.controllers');

controllers.controller('ProntuariosController', ['$rootScope', '$scope', '$http', '$state', 'Prontuario',
  function($rootScope, $scope, $http, $state, Prontuario) {
    $rootScope.currentMenu = 'prontuarios';

    $scope.filtro = '';
    $scope.ordem = '';

    $scope.offset  = 0;
    $scope.limit   = 10;
    $scope.total   = 0;
    $scope.page    = 0; 
    $scope.pages   = 0;
    $scope.paginas = [];

    $scope.procurando = true;
    $scope.prontuarios = [];

    $scope.irParaPagina = function(nPagina) {
      consultaProntuarios(nPagina < 0 ? $scope.pages : nPagina);
    };

    $scope.procurar = function() {
      consultaProntuarios(1);
    };

    // No início, carrega os prontuários da primeira página
    consultaProntuarios(1);

    function consultaProntuarios(nPagina) {
      $scope.procurando = true;
      $scope.offset = (nPagina - 1) * $scope.limit;
      $scope.prontuarios = [];

      var options = {offset: $scope.offset, limit: $scope.limit};

      if ($scope.filtro) {
        options.search = $scope.filtro;
      }

      if ($scope.ordem) {
        options.sort = $scope.ordem;
      }

      Prontuario.query(options, function(result) {
        $scope.prontuarios = result.docs;
        $scope.total = result.total;
        $scope.page  = nPagina;
        $scope.pages = Math.ceil(result.total / result.limit);

        calculaPaginacao();
        $scope.procurando = false;
      });
    }

    function calculaPaginacao() {
      $scope.paginas = [];

      var menorPagina = 1;
      var maiorPagina = 11;

      if ($scope.page > 5) {
        menorPagina = $scope.page - 5;
      }

      maiorPagina = menorPagina + 10;

      if (maiorPagina > $scope.pages) {
        maiorPagina = $scope.pages;
        menorPagina = maiorPagina - 10;
      }

      menorPagina = menorPagina < 1 ? 1 : menorPagina;

      for (var i = menorPagina; i <= maiorPagina; i++) {
        $scope.paginas.push(i);
      }
    }

    $scope.ordena = function(campo) {
      $scope.ordem = campo;
      consultaProntuarios(1);
    };

    $scope.detalhe = function(prontuario) {
      $state.go('editar_prontuario', {id: prontuario._id});
    };

    $scope.excluir = function(prontuario) {
      $scope.prontuarioParaExcluir = prontuario;
      $('#modal_excluir_prontuario').modal('show');
    };

    $scope.confirmaExcluir = function() {
      $('#modal_excluir_prontuario').modal('hide');

      $http.delete('/prontuarios/' + $scope.prontuarioParaExcluir._id).then(function(retorno) {
        $scope.prontuarios = Prontuario.query();
      });
    };
  }
]);

controllers.controller('NovoProntuarioController', ['$rootScope', '$scope', '$http', '$state', 'Prontuario',
  function($rootScope, $scope, $http, $state, Prontuario) {
    $rootScope.currentMenu = 'novo_prontuario';

    $scope.prontuario = {};

    $scope.salvar = function() {
      new Prontuario($scope.prontuario).$save(function() {
        $state.go('prontuarios');
      });
    };
  }
]);

controllers.controller('EditarProntuarioController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'Prontuario', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, Prontuario, AuthService) {
    $rootScope.currentMenu = 'editar_prontuario';

    $scope.admin = AuthService.isAdmin();
    $scope.prontuario = Prontuario.get({id: $stateParams.id});

    $scope.salvar = function() {
      Prontuario.update({id: $stateParams.id}, $scope.prontuario).$promise.then(function() {
        $state.go('prontuarios');
      });
    };
  }
]);
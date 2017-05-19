import angular from 'angular';
import PrintToPdf from '../util/print';
import '../services';

// Cria o módulo
const controllers = angular.module('ipesq.controllers', ['ipesq.services']);

// Cria os controladores
controllers.controller('MainController', ['$rootScope', 
  function($rootScope) {
    $rootScope.currentMenu = 'index';
  }
]);

controllers.controller('LaudosController', ['$rootScope', '$scope', '$http', '$stateParams', function($rootScope, $scope, $http, $stateParams) {
  $rootScope.currentMenu = 'novo';
  $scope.id_prontuario = $stateParams.id_prontuario;

  function novoLaudo() {
    return {
      dataResultado: new Date(),
      materialColetado: {},
      sintomas: {},
      resultado: null,
      conclusao: {
        zikv: {},
        chikv: {}
      }
    };
  }

  if ($stateParams.id_laudo) {
    $http.get('/prontuarios/' + $stateParams.id_prontuario + '/laudos/' + $stateParams.id_laudo).then(function(retorno) {
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
      console.log($scope.laudo);
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
      $http.post('/prontuarios/' + $scope.id_prontuario + '/laudos', $scope.laudo).then(function() {
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

  $scope.onUploadedAssinatura = function(blob) {
    console.log(blob);
    $scope.laudo.assinatura = blob.url;
  };
}]);

controllers.controller('ListaController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', function($rootScope, $scope, $http, $state, $stateParams) {
  $rootScope.currentMenu = 'lista';
  $scope.id_prontuario = $stateParams.id_prontuario;
  $scope.laudos = [];

  function carregaLaudos() {
    $http.get('/prontuarios/' + $scope.id_prontuario + '/laudos').then(function(retorno) {
      $scope.laudos = retorno.data;
    }, function(error) {
      console.log('Deu erro');
    });
  }

  carregaLaudos();

  $scope.detalhe = function(laudo) {
    $state.go('editar_laudo', {id_laudo: laudo._id, id_prontuario: $scope.id_prontuario});
  };

  $scope.excluir = function(laudo) {
    $http.get('/prontuarios/' + $scope.id_prontuario + '/laudos/' + laudo._id + '/delete').then(function(retorno) {
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
          $scope.errorMessage = "Nome de usuario ou senha invalidos";
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
      AuthService.register($scope.registerForm.nome, 
                           $scope.registerForm.admin, 
                           $scope.registerForm.username, 
                           $scope.registerForm.password)
        // handle success
        .then(function success() {
          $state.transitionTo('login');
          $scope.disabled = false;
          $scope.registerForm = {};
        }, function error() {
          $scope.error = true;
          $scope.errorMessage = "Ops, algo deu errado!";
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

// Prontuários
controllers.controller('ProntuariosController', ['$rootScope', '$scope', '$http', '$state', 'Prontuario',
  function($rootScope, $scope, $http, $state, Prontuario) {
    $rootScope.currentMenu = 'prontuarios';

    $scope.filtro = '';
    $scope.ordem = '';
    $scope.prontuarios = Prontuario.query();
    $scope.pFiltrados = [];

    $scope.ordena = function(campo) {
      $scope.ordem = campo;
    };

    $scope.detalhe = function(prontuario) {
      $state.go('editar_prontuario', {id: prontuario._id});
    };
  }
]);

controllers.controller('NovoProntuarioController', ['$rootScope', '$scope', '$http', '$state', 
  function($rootScope, $scope, $http, $state) {
    $rootScope.currentMenu = 'novo_prontuario';

    $scope.prontuario = {};

    $scope.salvar = function() {
      new Prontuario($scope.prontuario).$save(function() {
        $state.go('prontuarios');
      });
    };
  }
]);

controllers.controller('EditarProntuarioController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'Prontuario',
  function($rootScope, $scope, $http, $state, $stateParams, Prontuario) {
    $rootScope.currentMenu = 'editar_prontuario';

    $scope.prontuario = Prontuario.get({id: $stateParams.id});

    $scope.salvar = function() {
      new Prontuario($scope.prontuario).$save(function() {
        $state.go('prontuarios');
      });
    };
  }
]);
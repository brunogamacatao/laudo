import angular from 'angular';
import PrintToPdf from '../util/print';

const controllers = angular.module('ipesq.controllers');

controllers.controller('LaudosController', 
['$rootScope', '$scope', '$http', '$stateParams', 'Prontuario', 'AuthService',
function($rootScope, $scope, $http, $stateParams, Prontuario, AuthService) {
  $rootScope.currentMenu = 'novo';
  $scope.id_prontuario = $stateParams.id_prontuario;
  $scope.admin = AuthService.isAdmin();

  function novoLaudo() {
    return {
      dataResultado: new Date(),
      materialColetado: {},
      sintomas: {},
      resultado: null,
      conclusao: {
        zikv: {},
        chikv: {},
        sifilis: {},
        rubeola: {},
        toxoplasmose: {},
        citomegalovirus: {},
        herpes: {},
        dengue: {}
      }
    };
  }

  $scope.mudaNome = function() {
    if ($scope.prontuario) {
      if ($scope.laudo.referente == 'mae') {
        $scope.laudo.nome = $scope.prontuario.mae.nome;
      } else if ($scope.laudo.referente == 'filho') {
        $scope.laudo.nome = $scope.prontuario.crianca.nome;
      }
    }
  };

  function carregaProntuario() {
    Prontuario.get({id: $scope.id_prontuario}, function(prontuario) {
      $scope.prontuario = prontuario;
    });
  }

  if ($stateParams.id_laudo) {
    $http.get('/prontuarios/' + $stateParams.id_prontuario + '/laudos/' + $stateParams.id_laudo).then(function(retorno) {
      if (!retorno.data.referente) {
        retorno.data.referente = 'mae';
      }

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
      carregaProntuario();
    });
  } else {
    $scope.laudo = novoLaudo();
    carregaProntuario();
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
    carregaProntuario();
  };

  $scope.onUploadedAssinatura = function(blob) {
    console.log(blob);
    $scope.laudo.assinatura = blob.url;
  };
}]);

controllers.controller('ListaController', 
['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
  $rootScope.currentMenu = 'lista';
  $scope.id_prontuario = $stateParams.id_prontuario;
  $scope.laudos = [];
  $scope.admin = AuthService.isAdmin();

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
    $scope.laudoParaExcluir = laudo;
    $('#modal_excluir_laudo').modal('show');
  };

  $scope.confirmaExcluir = function() {
    $('#modal_excluir_laudo').modal('hide');
    $http.delete('/prontuarios/' + $scope.id_prontuario + '/laudos/' + $scope.laudoParaExcluir._id).then(function(retorno) {
      carregaLaudos();
    });
  };
}]);

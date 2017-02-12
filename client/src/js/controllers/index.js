import angular from 'angular';
import PrintToPdf from '../util/print';

// Cria o módulo
const controllers = angular.module('ipesq.controllers', []);

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

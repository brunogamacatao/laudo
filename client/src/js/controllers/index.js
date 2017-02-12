import angular from 'angular';
import PrintToPdf from '../util/print';

// Cria o módulo
const controllers = angular.module('ipesq.controllers', []);

// Cria os controladores
controllers.controller('MainController', ['$scope', function($scope) {
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

  $scope.laudo = novoLaudo();

  $scope.emitir = function() {
    new PrintToPdf($scope.laudo).print();
  };

  $scope.limpar = function() {
    $scope.laudo = novoLaudo();
  };
}]);
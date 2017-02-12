import angular from 'angular';

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
    console.log($scope.laudo);
  };

  $scope.limpar = function() {
    $scope.laudo = novoLaudo();
  };
}]);
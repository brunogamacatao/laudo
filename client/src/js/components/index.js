import angular from 'angular';

// Cria o módulo
const components = angular.module('ipesq.components', ['ipesq.services']);

components.component('formMae', {
  templateUrl: 'prontuario/_mae.html',
  bindings: { 
    mae: '=' 
  }
});

components.component('formCrianca', {
  templateUrl: 'prontuario/_crianca.html',
  bindings: { 
    crianca: '=' 
  }
});

components.component('menuProntuario', {
  templateUrl: 'partials/_menu.html',
  bindings: {
    ativo: '@',
    idProntuario: '<' 
  },
  controller: ['$scope', '$state', 'AuthService', 
  function($scope, $state, AuthService) {
    var ctrl = this;
    $scope.admin = AuthService.isAdmin();
  }]
});

export default components;
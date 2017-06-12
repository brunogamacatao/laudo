import angular from 'angular';
import Excel, {laudosToArray, prontuariosToArray, examesToArray, gmfmsToArray} from '../util/excel';

const controllers = angular.module('ipesq.controllers');

controllers.controller('MainController', ['$rootScope', '$scope', 'Prontuario', 'AuthService', '$http',
  function($rootScope, $scope, Prontuario, AuthService, $http) {
    $rootScope.currentMenu = 'index';
    $scope.admin = AuthService.isAdmin();
    $scope.prontuariosCount = 0;

    Prontuario.count((data) => $scope.prontuariosCount = data.count);

    $scope.exportar = function() {
      // Carrega os prontuários
      Prontuario.query(function(result) {
        var excel = new Excel();
        excel.addSheet('Prontuários', prontuariosToArray(result.docs));

        // Carrega os laudos
        $http.get('/prontuarios/laudos').then(function(retorno) {
          var laudos = retorno.data;
          excel.addSheet('Laudos', laudosToArray(laudos));

          // Carrega os exames
          $http.get('/prontuarios/exames').then(function(retorno) {
            var exames = retorno.data;
            excel.addSheet('Exames', examesToArray(exames));

            // Carrega os GMFMs
            $http.get('/prontuarios/gmfms').then(function(retorno) {
              var gmfms = retorno.data;
              excel.addSheet('GMFM', gmfmsToArray(gmfms));
              excel.save('ipesq.xlsx');
            });
          });
        });
      });
    };
  }
]);

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

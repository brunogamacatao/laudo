import angular from 'angular';
import Excel, {laudosToArray, prontuariosToArray, examesToArray, gmfmsToArray} from '../util/excel';

const controllers = angular.module('ipesq.controllers');

controllers.controller('ExportarController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'Prontuario',
  function($rootScope, $scope, $http, $state, $stateParams, Prontuario) {
    $rootScope.currentMenu = 'exportar';
    $scope.id_prontuario = $stateParams.id_prontuario;

    $scope.exportar = function() {
      var excel = new Excel();

      // Carrega o prontuário      
      Prontuario.get({id: $stateParams.id_prontuario}, function(prontuario) {
        excel.addSheet('Prontuário', prontuariosToArray([prontuario]));

        // Carrega os laudos
        $http.get('/prontuarios/' + $scope.id_prontuario + '/laudos').then(function(retorno) {
          var laudos = retorno.data;
          laudos.forEach((e) => e.prontuario = prontuario);
          excel.addSheet('Laudos', laudosToArray(laudos));

          // Carrega os exames
          $http.get('/prontuarios/' + $scope.id_prontuario + '/exames').then(function(retorno) {
            var exames = retorno.data;
            exames.forEach((e) => e.prontuario = prontuario);
            excel.addSheet('Exames', examesToArray(exames));

            // Carrega os GMFMs
            $http.get('/prontuarios/' + $scope.id_prontuario + '/gmfms').then(function(retorno) {
              var gmfms = retorno.data;
              gmfms.forEach((g) => g.prontuario = prontuario);
              excel.addSheet('GMFM', gmfmsToArray(gmfms));

              excel.save('ipesq.xlsx');
            });
          });
        });
      });
    };
  }
]);
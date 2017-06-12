import angular from 'angular';

const controllers = angular.module('ipesq.controllers');

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

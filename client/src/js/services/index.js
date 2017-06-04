import angular from 'angular';

// Cria o módulo
const services = angular.module('ipesq.services', []);

var token = null;

services.factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user  = null;
    var admin = false;

    // return available functions for use in the controllers
    return ({
      setUserStatus: setUserStatus,
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register,
      isAdmin: isAdmin,
      getToken: getToken,
      setToken: setToken
    });

    function isAdmin() {
      return admin;
    }

    function getToken() {
      return token;
    }

    function setToken(_token) {
      token = _token;
    }

    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }

    function setUserStatus(status) {
      user = status;
    }

    function getUserStatus() {
      return $http.get('/user/status');
    }

    function login(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/login',
        {username: username, password: password})
        // handle success
        .then(function success(data, status) {
          if(data.status === 200 && data.status){
            user  = data.data;
            admin = data.data.admin;
            token = data.data.token;
            deferred.resolve();
          } else {
            user  = false;
            admin = false;
            token = null;
            deferred.reject();
          }
        }, function error(data) {
          user  = false;
          admin = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/user/logout')
        // handle success
        .then(function success(data) {
          user = false;
          token = null;
          deferred.resolve();
        }, function error(data) {
          user = false;
          token = null;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(nome, admin, username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/register',
        {nome: nome, admin: admin || false, username: username, password: password})
        // handle success
        .then(function success(data, status) {
          console.log(data);
          if(data.status === 200 && data.statusText === 'OK'){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        }, function error(data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

}]);

services.factory('Prontuario', ['$resource', function($resource) {
  var headers = {'Authorization': function() {
    return 'Bearer ' + token;
  }};

  var actions = {
    'get'   : {method: 'GET', headers: headers},
    'save'  : {method: 'POST', headers: headers},
    'create': {method: 'POST', headers: headers},
    'query' : {method: 'GET', headers: headers},
    'remove': {method: 'DELETE', headers: headers},
    'delete': {method: 'DELETE', headers: headers},
    'update': {method: 'PUT', headers: headers},
    'count' : {method: 'GET', headers: headers, url: '/prontuarios/count'}
  };

  return $resource('/prontuarios/:id', null, actions);
}]);
function setupRoutes($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('index', {
      url: '',
      templateUrl: 'home.html',
      controller: 'MainController'
    });

  $urlRouterProvider.otherwise('/');
}

export default setupRoutes;
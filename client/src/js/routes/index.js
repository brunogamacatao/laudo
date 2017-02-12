function setupRoutes($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: 'home.html',
      controller: 'MainController'
    })
    .state('editar', {
      url: '/editar/:id',
      templateUrl: 'home.html',
      controller: 'MainController'
    })
    .state('lista', {
      url: '/lista',
      templateUrl: 'lista.html',
      controller: 'ListaController'
    });

  $urlRouterProvider.otherwise('/');
}

export default setupRoutes;
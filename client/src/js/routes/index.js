function setupRoutes($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/',
      templateUrl: 'login.html',
      controller: 'LoginController'
    })
    .state('logout', {
      url: '/logout',
      controller: 'LogoutController'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'register.html',
      controller: 'RegisterController'
    })
    .state('index', {
      url: '/main',
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
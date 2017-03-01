function setupRoutes($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/',
      templateUrl: 'login.html',
      controller: 'LoginController',
      authenticate: false
    })
    .state('logout', {
      url: '/logout',
      controller: 'LogoutController',
      authenticate: false
    })
    .state('register', {
      url: '/register',
      templateUrl: 'register.html',
      controller: 'RegisterController',
      authenticate: false
    })
    .state('index', {
      url: '/main',
      templateUrl: 'home.html',
      controller: 'MainController',
      authenticate: true
    })
    .state('editar', {
      url: '/editar/:id',
      templateUrl: 'home.html',
      controller: 'MainController',
      authenticate: true
    })
    .state('lista', {
      url: '/lista',
      templateUrl: 'lista.html',
      controller: 'ListaController',
      authenticate: true
    });

  $urlRouterProvider.otherwise('/');
}

export default setupRoutes;
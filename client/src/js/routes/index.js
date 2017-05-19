function setupRoutes($stateProvider, $urlRouterProvider) {
  $stateProvider
    // Estados do login
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
    // Página principal
    .state('index', {
      url: '/main',
      templateUrl: 'home.html',
      controller: 'MainController',
      authenticate: true
    })
    // Estados dos laudos
    .state('novo_laudo', {
      url: '/prontuarios/:id_prontuario/novo_laudo',
      templateUrl: 'laudos_form.html',
      controller: 'LaudosController',
      authenticate: true
    })
    .state('editar_laudo', {
      url: '/prontuarios/:id_prontuario/editar_laudo/:id_laudo',
      templateUrl: 'laudos_form.html',
      controller: 'LaudosController',
      authenticate: true
    })
    .state('listar_laudos', {
      url: '/prontuarios/:id_prontuario/laudos',
      templateUrl: 'laudos.html',
      controller: 'ListaController',
      authenticate: true
    })
    // Estados dos prontuários
    .state('prontuarios', {
      url: '/prontuarios',
      templateUrl: 'prontuarios.html',
      controller: 'ProntuariosController',
      authenticate: true
    })
    .state('novo_prontuario', {
      url: '/novo_prontuario',
      templateUrl: 'prontuarios_form.html',
      controller: 'NovoProntuarioController',
      authenticate: true
    })
    .state('editar_prontuario', {
      url: '/prontuarios/:id',
      templateUrl: 'prontuarios_form.html',
      controller: 'EditarProntuarioController',
      authenticate: true
    });

  $urlRouterProvider.otherwise('/');
}

export default setupRoutes;
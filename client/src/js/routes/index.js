function setupRoutes($stateProvider, $urlRouterProvider) {
  $stateProvider
    // Estados do login
    .state('login', {
      url: '/',
      templateUrl: 'login/login.html',
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
      templateUrl: 'login/register.html',
      controller: 'RegisterController',
      authenticate: false
    })
    // Página principal
    .state('index', {
      url: '/main',
      templateUrl: 'main.html',
      controller: 'MainController',
      authenticate: true
    })
    // Estados dos laudos
    .state('novo_laudo', {
      url: '/prontuarios/:id_prontuario/novo_laudo',
      templateUrl: 'laudo/form.html',
      controller: 'LaudosController',
      authenticate: true
    })
    .state('editar_laudo', {
      url: '/prontuarios/:id_prontuario/editar_laudo/:id_laudo',
      templateUrl: 'laudo/form.html',
      controller: 'LaudosController',
      authenticate: true
    })
    .state('listar_laudos', {
      url: '/prontuarios/:id_prontuario/laudos',
      templateUrl: 'laudo/list.html',
      controller: 'ListaController',
      authenticate: true
    })
    // Estados dos exames
    .state('novo_exame', {
      url: '/prontuarios/:id_prontuario/novo_exame',
      templateUrl: 'exame/form.html',
      controller: 'NovoExameController',
      authenticate: true
    })
    .state('editar_exame', {
      url: '/prontuarios/:id_prontuario/editar_exame/:id_exame',
      templateUrl: 'exame/form.html',
      controller: 'EditarExameController',
      authenticate: true
    })
    .state('listar_exames', {
      url: '/prontuarios/:id_prontuario/exames',
      templateUrl: 'exame/list.html',
      controller: 'ListarExamesController',
      authenticate: true
    })
    // Estados dos prontuários
    .state('prontuarios', {
      url: '/prontuarios',
      templateUrl: 'prontuario/list.html',
      controller: 'ProntuariosController',
      authenticate: true
    })
    .state('novo_prontuario', {
      url: '/novo_prontuario',
      templateUrl: 'prontuario/form.html',
      controller: 'NovoProntuarioController',
      authenticate: true
    })
    .state('editar_prontuario', {
      url: '/prontuarios/:id',
      templateUrl: 'prontuario/form.html',
      controller: 'EditarProntuarioController',
      authenticate: true
    });

  $urlRouterProvider.otherwise('/main');
}

export default setupRoutes;
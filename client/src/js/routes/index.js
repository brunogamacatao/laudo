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
    // Estados dos gmfms
    .state('novo_gmfm', {
      url: '/prontuarios/:id_prontuario/novo_gmfm',
      templateUrl: 'gmfm/form.html',
      controller: 'NovoGMFMController',
      authenticate: true
    })
    .state('editar_gmfm', {
      url: '/prontuarios/:id_prontuario/editar_gmfm/:id_gmfm',
      templateUrl: 'gmfm/form.html',
      controller: 'EditarGMFMController',
      authenticate: true
    })
    .state('listar_gmfms', {
      url: '/prontuarios/:id_prontuario/gmfms',
      templateUrl: 'gmfm/list.html',
      controller: 'ListarGMFMSController',
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
    })
    // Questionário SUS
    .state('novo_questionario', {
      url: '/prontuarios/:id_prontuario/novo_questionario',
      templateUrl: 'questionario/form.html',
      controller: 'NovoQuestionarioController',
      authenticate: true
    })
    // Exportar
    .state('exportar', {
      url: '/prontuarios/:id_prontuario/exportar',
      templateUrl: 'exportar/index.html',
      controller: 'ExportarController',
      authenticate: true
    });

  $urlRouterProvider.otherwise('/main');
}

export default setupRoutes;
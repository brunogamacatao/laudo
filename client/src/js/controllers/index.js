import angular from 'angular';
import PrintToPdf from '../util/print';
import '../services';
import Excel, {laudosToArray, prontuariosToArray, examesToArray, gmfmsToArray} from '../util/excel';

// Cria o módulo
const controllers = angular.module('ipesq.controllers', ['ipesq.services']);

// Cria os controladores
controllers.controller('MainController', ['$rootScope', '$scope', 'Prontuario',
  function($rootScope, $scope, Prontuario) {
    $rootScope.currentMenu = 'index';
    $scope.prontuarios = Prontuario.query();
  }
]);

controllers.controller('LaudosController', 
['$rootScope', '$scope', '$http', '$stateParams', 'Prontuario', 'AuthService',
function($rootScope, $scope, $http, $stateParams, Prontuario, AuthService) {
  $rootScope.currentMenu = 'novo';
  $scope.id_prontuario = $stateParams.id_prontuario;
  $scope.admin = AuthService.isAdmin();

  function novoLaudo() {
    return {
      dataResultado: new Date(),
      materialColetado: {},
      sintomas: {},
      resultado: null,
      conclusao: {
        zikv: {},
        chikv: {}
      }
    };
  }

  function carregaProntuario() {
    Prontuario.get({id: $scope.id_prontuario}, function(prontuario) {
      $scope.laudo.nome = prontuario.mae.nome;
    });
  }

  if ($stateParams.id_laudo) {
    $http.get('/prontuarios/' + $stateParams.id_prontuario + '/laudos/' + $stateParams.id_laudo).then(function(retorno) {
      // Conversão das datas
      if (retorno.data.dataInicioSintomas) {
        retorno.data.dataInicioSintomas = new Date(retorno.data.dataInicioSintomas);
      }

      if (retorno.data.dataColeta) {
        retorno.data.dataColeta = new Date(retorno.data.dataColeta);
      }

      if (retorno.data.dataResultado) {
        retorno.data.dataResultado = new Date(retorno.data.dataResultado);
      }

      $scope.laudo = retorno.data;
      carregaProntuario();
    });
  } else {
    $scope.laudo = novoLaudo();
    carregaProntuario();
  }


  $scope.emitir = function() {

    if ($scope.laudo._id) {
      console.log('Imprimindo ...');
      new PrintToPdf($scope.laudo).print();
    } else {
      console.log('Salvando ...');
      $http.post('/prontuarios/' + $scope.id_prontuario + '/laudos', $scope.laudo).then(function() {
        console.log('Pronto');
        new PrintToPdf($scope.laudo).print();
      }, function(error) {
        console.log('Deu erro');
      });
    }
  };

  $scope.limpar = function() {
    $scope.laudo = novoLaudo();
    carregaProntuario();
  };

  $scope.onUploadedAssinatura = function(blob) {
    console.log(blob);
    $scope.laudo.assinatura = blob.url;
  };
}]);

controllers.controller('ListaController', 
['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
  $rootScope.currentMenu = 'lista';
  $scope.id_prontuario = $stateParams.id_prontuario;
  $scope.laudos = [];
  $scope.admin = AuthService.isAdmin();

  function carregaLaudos() {
    $http.get('/prontuarios/' + $scope.id_prontuario + '/laudos').then(function(retorno) {
      $scope.laudos = retorno.data;
    }, function(error) {
      console.log('Deu erro');
    });
  }

  carregaLaudos();

  $scope.detalhe = function(laudo) {
    $state.go('editar_laudo', {id_laudo: laudo._id, id_prontuario: $scope.id_prontuario});
  };

  $scope.excluir = function(laudo) {
    $scope.laudoParaExcluir = laudo;
    $('#modal_excluir_laudo').modal('show');
  };

  $scope.confirmaExcluir = function() {
    $('#modal_excluir_laudo').modal('hide');
    $http.delete('/prontuarios/' + $scope.id_prontuario + '/laudos/' + $scope.laudoParaExcluir._id).then(function(retorno) {
      carregaLaudos();
    });
  };
}]);

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

controllers.controller('NavbarController', 
  ['$scope', '$rootScope', '$state', 'AuthService',
  function ($scope, $rootScope, $state, AuthService) {
    $scope.isLoggedIn = AuthService.isLoggedIn();

    $rootScope.$on('login', function() {
      $scope.isLoggedIn = AuthService.isLoggedIn();
    });

    $rootScope.$on('logout', function() {
      $scope.isLoggedIn = AuthService.isLoggedIn();
    });
}]);

// Prontuários
controllers.controller('ProntuariosController', ['$rootScope', '$scope', '$http', '$state', 'Prontuario',
  function($rootScope, $scope, $http, $state, Prontuario) {
    $rootScope.currentMenu = 'prontuarios';

    $scope.filtro = '';
    $scope.ordem = '';
    $scope.prontuarios = Prontuario.query();
    $scope.pFiltrados = [];

    $scope.ordena = function(campo) {
      $scope.ordem = campo;
    };

    $scope.detalhe = function(prontuario) {
      $state.go('editar_prontuario', {id: prontuario._id});
    };

    $scope.excluir = function(prontuario) {
      $scope.prontuarioParaExcluir = prontuario;
      $('#modal_excluir_prontuario').modal('show');
    };

    $scope.confirmaExcluir = function() {
      $('#modal_excluir_prontuario').modal('hide');

      $http.delete('/prontuarios/' + $scope.prontuarioParaExcluir._id).then(function(retorno) {
        $scope.prontuarios = Prontuario.query();
      });
    };
  }
]);

controllers.controller('NovoProntuarioController', ['$rootScope', '$scope', '$http', '$state', 'Prontuario',
  function($rootScope, $scope, $http, $state, Prontuario) {
    $rootScope.currentMenu = 'novo_prontuario';

    $scope.prontuario = {};

    $scope.salvar = function() {
      new Prontuario($scope.prontuario).$save(function() {
        $state.go('prontuarios');
      });
    };
  }
]);

controllers.controller('EditarProntuarioController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'Prontuario', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, Prontuario, AuthService) {
    $rootScope.currentMenu = 'editar_prontuario';

    $scope.admin = AuthService.isAdmin();
    $scope.prontuario = Prontuario.get({id: $stateParams.id});

    $scope.salvar = function() {
      Prontuario.update({id: $stateParams.id}, $scope.prontuario).$promise.then(function() {
        $state.go('prontuarios');
      });
    };
  }
]);

// ----------------------------------------------------------------------------
// EXAMES
// ----------------------------------------------------------------------------

controllers.controller('NovoExameController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'novo_exame';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.exame = {};
    $scope.unidade = '';

    $scope.salvar = function() {
      $http.post('/prontuarios/' + $scope.id_prontuario + '/exames', $scope.exame).then(function() {
        console.log('Pronto');
        $state.go('listar_exames', {id_prontuario: $scope.id_prontuario});
      }, function(error) {
        console.log('Deu erro');
      });
    };

    $scope.mudaUnidade = function() {
      var unidades = ['', 'semanas', 'dias', 'meses', 'dias'];
      $scope.unidade = unidades[parseInt($('#nome_exame_select').prop('selectedIndex'))];
    }
  }
]);

controllers.controller('EditarExameController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'editar_exame';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.exame = {};
    $scope.unidade = '';

    $http.get('/prontuarios/' + $stateParams.id_prontuario + '/exames/' + $stateParams.id_exame).then(function(retorno) {
      // Conversão das datas
      if (retorno.data.data) {
        retorno.data.data = new Date(retorno.data.data);
      }

      $scope.exame = retorno.data;
    });

    $scope.salvar = function() {
      $http.put('/prontuarios/' + $scope.id_prontuario + '/exames/' + $stateParams.id_exame, $scope.exame).then(function() {
        console.log('Pronto');
        $state.go('listar_exames', {id_prontuario: $scope.id_prontuario});
      }, function(error) {
        console.log('Deu erro');
      });
    };

    $scope.mudaUnidade = function() {
      var unidades = ['', 'semanas', 'dias', 'meses', 'dias'];
      $scope.unidade = unidades[parseInt($('#nome_exame_select').prop('selectedIndex'))];
    }

  }
]);

controllers.controller('ListarExamesController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'listar_exames';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.exames = [];

    function carregaExames() {
      $http.get('/prontuarios/' + $scope.id_prontuario + '/exames').then(function(retorno) {
        $scope.exames = retorno.data;
      }, function(error) {
        console.log('Deu erro');
      });
    }

    carregaExames();
    
    $scope.detalhe = function(exame) {
      $state.go('editar_exame', {id_exame: exame._id, id_prontuario: $scope.id_prontuario});
    };

    $scope.excluir = function(exame) {
      $scope.exameParaExcluir = exame;
      $('#modal_excluir_exame').modal('show');
    };

    $scope.confirmaExcluir = function() {
      $('#modal_excluir_exame').modal('hide');
      $http.delete('/prontuarios/' + $scope.id_prontuario + '/exames/' + $scope.exameParaExcluir._id).then(function(retorno) {
        carregaExames();
      });
    };
  }
]);

// ----------------------------------------------------------------------------
// GMFMS
// ----------------------------------------------------------------------------

controllers.controller('NovoGMFMController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'novo_gmfm';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.gmfm = {};

    $scope.salvar = function() {
      $http.post('/prontuarios/' + $scope.id_prontuario + '/gmfms', $scope.gmfm).then(function() {
        console.log('Pronto');
        $state.go('listar_gmfms', {id_prontuario: $scope.id_prontuario});
      }, function(error) {
        console.log('Deu erro');
      });
    };
  }
]);

controllers.controller('EditarGMFMController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'editar_gmfm';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.gmfm = {};

    $http.get('/prontuarios/' + $stateParams.id_prontuario + '/gmfms/' + $stateParams.id_gmfm).then(function(retorno) {
      // Conversão das datas
      if (retorno.data.data) {
        retorno.data.data = new Date(retorno.data.data);
      }

      $scope.gmfm = retorno.data;
    });

    $scope.salvar = function() {
      $http.put('/prontuarios/' + $scope.id_prontuario + '/gmfms/' + $stateParams.id_gmfm, $scope.gmfm).then(function() {
        console.log('Pronto');
        $state.go('listar_gmfms', {id_prontuario: $scope.id_prontuario});
      }, function(error) {
        console.log('Deu erro');
      });
    };
  }
]);

controllers.controller('ListarGMFMSController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'AuthService',
  function($rootScope, $scope, $http, $state, $stateParams, AuthService) {
    $rootScope.currentMenu = 'listar_gmfms';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.admin = AuthService.isAdmin();

    $scope.gmfms = [];

    function carrega() {
      $http.get('/prontuarios/' + $scope.id_prontuario + '/gmfms').then(function(retorno) {
        $scope.gmfms = retorno.data;
      }, function(error) {
        console.log('Deu erro');
      });
    }

    carrega();
    
    $scope.detalhe = function(gmfm) {
      $state.go('editar_gmfm', {id_gmfm: gmfm._id, id_prontuario: $scope.id_prontuario});
    };

    $scope.excluir = function(gmfm) {
      $scope.gmfmParaExcluir = gmfm;
      $('#modal_excluir_gmfm').modal('show');
    };

    $scope.confirmaExcluir = function() {
      $('#modal_excluir_gmfm').modal('hide');
      $http.delete('/prontuarios/' + $scope.id_prontuario + '/gmfms/' + $scope.gmfmParaExcluir._id).then(function(retorno) {
        carrega();
      });
    };
  }
]);

// Exportar
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

import angular from 'angular';

const controllers = angular.module('ipesq.controllers');

controllers.controller('NovoQuestionarioController', ['$rootScope', '$scope', '$state', '$stateParams', '$http',
  function($rootScope, $scope, $state, $stateParams, $http) {
    $rootScope.currentMenu = 'novo';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.questionario = novoQuestionario();

    $http.get('/prontuarios/' + $stateParams.id_prontuario + '/questionarios').then(function(retorno) {
      if (retorno && retorno.data && retorno.data.length > 0) {
        var q = retorno.data[0];

        // Converte as datas para objetos Date
        if (q.recemNascido.dataParto) q.recemNascido.dataParto = new Date(q.recemNascido.dataParto);
        if (q.recemNascido.hemograma.data) q.recemNascido.hemograma.data = new Date(q.recemNascido.hemograma.data);
        if (q.recemNascido.puncaoLiquorica.data) q.recemNascido.puncaoLiquorica.data = new Date(q.recemNascido.puncaoLiquorica.data);

        if (q.recemNascido.examesEtiologicos && q.recemNascido.examesEtiologicos.length > 0) {
          for (var i = 0; i < q.recemNascido.examesEtiologicos.length; i++) {
            for (var j = 0; j < q.recemNascido.examesEtiologicos[i].dados.length; j++) {
              if (q.recemNascido.examesEtiologicos[i].dados[j].data) {
                q.recemNascido.examesEtiologicos[i].dados[j].data = new Date(q.recemNascido.examesEtiologicos[i].dados[j].data);
              }
            }
          }
        }

        if (q.recemNascido.examesCranianos && q.recemNascido.examesCranianos.length > 0) {
          for (var i = 0; i < q.recemNascido.examesCranianos.length; i++) {
            if (q.recemNascido.examesCranianos[i].data) {
              q.recemNascido.examesCranianos[i].data = new Date(q.recemNascido.examesCranianos[i].data);
            }
          }
        }

        if (q.recemNascido.exames && q.recemNascido.exames.length > 0) {
          for (var i = 0; i < q.recemNascido.exames.length; i++) {
            if (q.recemNascido.exames[i].data) {
              q.recemNascido.exames[i].data = new Date(q.recemNascido.exames[i].data);
            }
          }
        }

        if (q.mae.dataDeNascimento) q.mae.dataDeNascimento = new Date(q.mae.dataDeNascimento);

        if (q.mae.viagens && q.mae.viagens.length > 0) {
          for (var i = 0; i < q.mae.viagens.length; i++) {
            if (q.mae.viagens[i].dataDeIda) q.mae.viagens[i].dataDeIda = new Date(q.mae.viagens[i].dataDeIda);
            if (q.mae.viagens[i].dataDeVolta) q.mae.viagens[i].dataDeVolta = new Date(q.mae.viagens[i].dataDeVolta);
          }
        }

        if (q.mae.historicoObstetricio.dataNascimentoUltimoFilho) q.mae.historicoObstetricio.dataNascimentoUltimoFilho = new Date(q.mae.historicoObstetricio.dataNascimentoUltimoFilho);

        if (q.mae.duranteGestacao.medicamentos && q.mae.duranteGestacao.medicamentos.length > 0) {
          for (var i = 0; i < q.mae.duranteGestacao.medicamentos.length; i++) {
            if (q.mae.duranteGestacao.medicamentos[i].dataInicioTratamento) q.mae.duranteGestacao.medicamentos[i].dataInicioTratamento = new Date(q.mae.duranteGestacao.medicamentos[i].dataInicioTratamento);
          }
        }

        if (q.mae.historicoManchasVermelhas && q.mae.historicoManchasVermelhas.length > 0) {
          for (var i = 0; i < q.mae.historicoManchasVermelhas.length; i++) {
            if (q.mae.historicoManchasVermelhas[i].dataInicioEnxatema) q.mae.historicoManchasVermelhas[i].dataInicioEnxatema = new Date(q.mae.historicoManchasVermelhas[i].dataInicioEnxatema);
          }
        }

        if (q.mae.prenatal.dataPrimeiraConsulta) q.mae.prenatal.dataPrimeiraConsulta = new Date(q.mae.prenatal.dataPrimeiraConsulta);

        if (q.mae.prenatal.historicoVacinal && q.mae.prenatal.historicoVacinal.length > 0) {
          for (var i = 0; i < q.mae.prenatal.historicoVacinal.length; i++) {
            if (q.mae.prenatal.historicoVacinal[i].dataDoses[0]) q.mae.prenatal.historicoVacinal[i].dataDoses[0] = new Date(q.mae.prenatal.historicoVacinal[i].dataDoses[0]);
            if (q.mae.prenatal.historicoVacinal[i].dataDoses[1]) q.mae.prenatal.historicoVacinal[i].dataDoses[1] = new Date(q.mae.prenatal.historicoVacinal[i].dataDoses[1]);
            if (q.mae.prenatal.historicoVacinal[i].dataDoses[2]) q.mae.prenatal.historicoVacinal[i].dataDoses[2] = new Date(q.mae.prenatal.historicoVacinal[i].dataDoses[2]);
          }
        }

        if (q.mae.prenatal.examesUltrassom && q.mae.prenatal.examesUltrassom.length > 0) {
          for (var i = 0; i < q.mae.prenatal.examesUltrassom.length; i++) {
            if (q.mae.prenatal.examesUltrassom[i].data) q.mae.prenatal.examesUltrassom[i].data = new Date(q.mae.prenatal.examesUltrassom[i].data);
          }
        }

        if (q.mae.prenatal.exames && q.mae.prenatal.exames.length > 0) {
          for (var i = 0; i < q.mae.prenatal.exames.length; i++) {
            if (q.mae.prenatal.exames[i].primeiroTrimestre.data) q.mae.prenatal.exames[i].primeiroTrimestre.data = new Date(q.mae.prenatal.exames[i].primeiroTrimestre.data);
            if (q.mae.prenatal.exames[i].segundoTrimestre.data) q.mae.prenatal.exames[i].segundoTrimestre.data = new Date(q.mae.prenatal.exames[i].segundoTrimestre.data);
            if (q.mae.prenatal.exames[i].terceiroTrimestre.data) q.mae.prenatal.exames[i].terceiroTrimestre.data = new Date(q.mae.prenatal.exames[i].terceiroTrimestre.data);
          }
        }

        if (q.encerramentoCaso.dataEvolucao) q.encerramentoCaso.dataEvolucao = new Date(q.encerramentoCaso.dataEvolucao);
        if (q.investigador.inicioInvestigacao) q.investigador.inicioInvestigacao = new Date(q.investigador.inicioInvestigacao);
        if (q.investigador.fimInvestigacao) q.investigador.fimInvestigacao = new Date(q.investigador.fimInvestigacao);

        $scope.questionario = q;
      }
    });

    $scope.salvar = function() {
      if ($scope.questionario._id) {
        $http.put('/prontuarios/' + $scope.id_prontuario + '/questionarios/' + $scope.questionario._id, $scope.questionario).then(function() {
          console.log('Pronto');
          $state.go('prontuarios');
        }, function(error) {
          console.log('Deu erro');
        });
      } else {
        $http.post('/prontuarios/' + $scope.id_prontuario + '/questionarios', $scope.questionario).then(function() {
          console.log('Pronto');
          $state.go('prontuarios');
        }, function(error) {
          console.log('Deu erro');
        });        
      }
    };

    $scope.adicionarExameEtiologico = function() {
      $scope.questionario.recemNascido.examesEtiologicos.push($scope.temp.exameEtiologico);
      $scope.temp.exameEtiologico = novoExameEtiologico();
    };

    $scope.adicionarViagem = function() {
      $scope.questionario.mae.viagens.push($scope.temp.viagem);
      $scope.temp.viagem = {};
    };

    $scope.adicionarMedicamento = function() {
      $scope.questionario.mae.duranteGestacao.medicamentos.push($scope.temp.medicamento);
      $scope.temp.medicamento = {};
    };

    $scope.excluirMedicamento = function(index) {
      $scope.questionario.mae.duranteGestacao.medicamentos.splice(index, 1);
    }

    $scope.adicionarDroga = function() {
      $scope.questionario.mae.habitos.usoDeDrogas.push($scope.temp.droga);
      $scope.temp.droga = {};
    };

    $scope.adicionarVacina = function() {
      $scope.questionario.mae.prenatal.historicoVacinal.push($scope.temp.vacina);
      $scope.temp.vacina = {
        numeroDeDoses: 1,
        dataDoses: []
      };
    };

    $scope.adicionarUltrassom = function() {
      $scope.questionario.mae.prenatal.examesUltrassom.push($scope.temp.ultrassom);
      $scope.temp.ultrassom = {};
    };

    $scope.adicionarExame = function() {
      $scope.questionario.mae.prenatal.exames.push($scope.temp.exame);
      $scope.temp.exame = {
        primeiroTrimestre: {},
        segundoTrimestre: {},
        terceiroTrimestre: {}
      };
    };


    function novoExameEtiologico() {
      return {
        dados: [
          {amostra: 'Soro do RN'},
          {amostra: 'Líquor do RN'},
          {amostra: 'Urina do RN'},
          {amostra: 'Sangue Materno'},
          {amostra: 'Urina Materna'},
          {amostra: 'Leite Materno'},
          {amostra: 'Sangue Paterno'},
          {amostra: 'Urina Paterna'},
          {amostra: 'Placenta'},
          {}
        ]
      };
    }

    function novoQuestionario() {
      $scope.temp = {
        exameEtiologico: novoExameEtiologico(),
        viagem: {},
        medicamento: {},
        droga: {},
        vacina: {
          numeroDeDoses: 1,
          dataDoses: []
        },
        ultrassom: {},
        exame: {
          primeiroTrimestre: {},
          segundoTrimestre: {},
          terceiroTrimestre: {}
        }
      };

      return {
        servicoSaude: {},
        recemNascido: {
          idadeGestacional: {},
          exameFisicoAoNascer: {},
          malformacoes: {},
          outrosAchadosClinicos: {},
          hemograma: {},
          puncaoLiquorica: {},
          examesEtiologicos: [],
          examesCranianos: [
            {nome: 'Tomografia craniana'},
            {nome: 'Ressonância magnética craniana'},
            {nome: 'Ultrassom transfontanela'}
          ],
          exames: [
            {nome: 'Ultrassom abdominal'},
            {nome: 'Ecocardiograma'},
            {nome: 'Fundo do olho'},
            {nome: 'Teste da orelhinha'},
            {nome: 'Raio X de Bacia'},
            {nome: 'Eletroencefalograma'}
          ]
        },
        mae: {
          enderecoAtual: {},
          outroEndereco: {},
          viagens: [],
          antecedentes: [
            {antecedente: 'parentesco com companheiro'},
            {antecedente: 'malformacao congenita'},
            {antecedente: 'microcefalia na familia'},
            {antecedente: 'medicamento de uso continuo'}
          ],
          doencasPreexistentes: {},
          tratamentosDST: {},
          historicoObstetricio: {},
          duranteGestacao: {
            contatoComPesticidas: {},
            contatoComAgrotoxicos: {},
            contatoProdutoQuimico: {},
            contatoRaioX: {},
            medicamentos: [
              {nome: 'Ácido fólico'},
              {nome: 'Ferro'}
            ]
          },
          historicoManchasVermelhas: [
            {trimestre: 1},
            {trimestre: 2},
            {trimestre: 3}
          ],
          habitos: {
            usoDeAlcool: {},
            tabagismo: {},
            usoDeDrogas: []
          },
          prenatal: {
            historicoVacinal: [],
            complicacoes: {},
            examesUltrassom: [],
            exames: [],
            doencasInfectoContagiosas: [],
            vrdl: []
          }
        },
        encerramentoCaso: {},
        investigador: {}
      };
    }
  }
]);

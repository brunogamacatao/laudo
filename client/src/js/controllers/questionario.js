import angular from 'angular';

const controllers = angular.module('ipesq.controllers');

controllers.controller('NovoQuestionarioController', ['$rootScope', '$scope', '$state', '$stateParams', '$http',
  function($rootScope, $scope, $state, $stateParams, $http) {
    $rootScope.currentMenu = 'novo';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.questionario = novoQuestionario();

    $http.get('/prontuarios/' + $stateParams.id_prontuario + '/questionarios').then(function(retorno) {
      console.log('retorno', retorno);
      if (retorno && retorno.data && retorno.data.length > 0) {
        $scope.questionario = retorno.data[0];
      }
    });

    $scope.salvar = function() {
      $http.post('/prontuarios/' + $scope.id_prontuario + '/questionarios', $scope.questionario).then(function() {
        console.log('Pronto');
        $state.go('editar_prontuario', {id_prontuario: $scope.id_prontuario});
      }, function(error) {
        console.log('Deu erro');
      });
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
          {amostra: 'Líquor'},
          {amostra: 'Urina'}
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
            {nome: 'Teste da orelhinha'}
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

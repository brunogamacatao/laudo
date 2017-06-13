import angular from 'angular';

const controllers = angular.module('ipesq.controllers');

controllers.controller('NovoQuestionarioController', ['$rootScope', '$scope', '$stateParams',
  function($rootScope, $scope, $stateParams) {
    $rootScope.currentMenu = 'novo';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.questionario = novoQuestionario();

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
        droga: {}
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

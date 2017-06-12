import angular from 'angular';

const controllers = angular.module('ipesq.controllers');

controllers.controller('NovoQuestionarioController', ['$rootScope', '$scope', '$stateParams',
  function($rootScope, $scope, $stateParams) {
    $rootScope.currentMenu = 'novo';
    $scope.id_prontuario = $stateParams.id_prontuario;
    $scope.questionario = novoQuestionario();

    $scope.adicionarExameEtiologico = function() {
      console.log('adicionarExameEtiologico');

      $scope.questionario.recemNascido.examesEtiologicos.push($scope.temp.exameEtiologico);
      $scope.temp.exameEtiologico = novoExameEtiologico();

      console.log($scope.questionario.recemNascido.examesEtiologicos);
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
        exameEtiologico: novoExameEtiologico()
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
          examesCranianos: [],
          exames: []
        },
        mae: {
          enderecoAtual: {},
          outroEndereco: {},
          viagens: [],
          antecedentes: [],
          doencasPreexistentes: {},
          tratamentosDST: {},
          historicoObstetricio: {},
          duranteGestacao: {
            contatoComPesticidas: {},
            contatoComAgrotoxicos: {},
            contatoProdutoQuimico: {},
            contatoRaioX: {},
            medicamentos: []
          },
          historicoManchasVermelhas: [],
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

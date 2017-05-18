var fs = require('fs');
var csv = require('csv');
var https = require('https');

var options = {
  hostname: 'laudozikv.herokuapp.com',
  port: 443,
  path: '/prontuarios',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

fs
  .createReadStream('/Users/brunogamacatao/temp/dados.csv')
  .pipe(csv.parse({
    columns: true,
    delimiter: ';'
  }))
  .pipe(csv.transform(function (r) {
    var prontuario = {
      mae: {
        nome: r.nome_mae,
        localAcompanhamento: r.local_acompanhamento,
        endereco: r.endereco,
        cidade: r.cidade,
        pontoDeReferencia: r.ponto_referencia,
        telefone: r.telefone_mae,
        telefoneContato: r.telefone_contato,
        dataDeNascimento: r.data_nascimento,
        gestacoes: r.gestacoes,
        nascimentos: r.nascimento,
        abortos: r.abortos,
        peso: r.peso_mae,
        altura: r.altura_mae,
        primeiraUltrassom: r.primeira_ultrason,
        ultimaUltrassom: r.ultima_ultrason,
        idadeGestacionalAdmissaoProjeto: r.idade_gestacional_admissao_projeto,
        enxatema: {
          historiaEnxatema: r.historia_exantema === 'Sim',
          trimestre: r.trimestre_exantema,
          mes: r.mes_exantema,
          idadeGestacionalEnxatemaMes: r.idade_gestacional_exatema_mes,
          idadeGestacionalEnxatemaTrimestre: r.idade_gestacional_exatema_trimestre
        }
      },
      crianca: {
        nome: r.nome_crianca,
        dataDeNascimento: r.nascimento_crianca,
        tipoDeParto: r.tipo_parto,
        idadeGestacionalParto: r.idade_gestacional_parto,
        condicaoNascimento: r.condicao_nascimento,
        maFormacao: r.ma_formacao,
        peso: r.peso_crianca,
        estatura: r.estatura,
        pc: r.pc,
        apgar1M: r.apgar_primeiro_minuto,
        apgar5M: r.apgar_quinto_minuto
      }
    };

    var body = JSON.stringify(prontuario);

    options.headers["Content-Length"] = Buffer.byteLength(body);
    var request = https.request(options);

    request.end(body);

    request.on('response', function (response) {
      console.log('STATUS: ' + response.statusCode);
    });
  }));

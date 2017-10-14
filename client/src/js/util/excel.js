class Excel {
  constructor() {
    this.SheetNames = [];
    this.Sheets = {};
  }

  datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
  }

  sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    for(var R = 0; R != data.length; ++R) {
      for(var C = 0; C != data[R].length; ++C) {
        if(range.s.r > R) range.s.r = R;
        if(range.s.c > C) range.s.c = C;
        if(range.e.r < R) range.e.r = R;
        if(range.e.c < C) range.e.c = C;
        var cell = {v: data[R][C] };
        if(cell.v == null) continue;
        var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
        
        if(typeof cell.v === 'number') cell.t = 'n';
        else if(typeof cell.v === 'boolean') cell.t = 'b';
        else if(cell.v instanceof Date) {
          cell.t = 'n'; cell.z = XLSX.SSF._table[14];
          cell.v = this.datenum(cell.v);
        }
        else cell.t = 's';
        
        ws[cell_ref] = cell;
      }
    }
    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
  }

  addSheet(name, data) {
    this.SheetNames.push(name);
    this.Sheets[name] = this.sheet_from_array_of_arrays(data);
  }

  save(filename) {
    var wbout = XLSX.write(this, {bookType:'xlsx', bookSST:true, type: 'binary'});

    var buf = new ArrayBuffer(wbout.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=wbout.length; ++i) view[i] = wbout.charCodeAt(i) & 0xFF;
    
    saveAs(new Blob([buf], {type:"application/octet-stream"}), filename);
  }
}

export var laudosToArray = function(laudos) {
  var colunas = ['ID do Prontuário', 'Nome', 'Data de Início dos Sintomas', 'Data da Coleta', 'Data do Resultado', 
  'Sangue', 'Urina', 'Líquido Amniótico', 'Líquido Cefalorraquidiano',
  'Febre', 'Dor de Cabeça', 'Exantema', 'Conjuntivite', 'Dor pelo corpo', 'Dor retro-orbital', 'Dor nas articulações',
  'Metodologia', 'Resultado', 
  'ZIKV Identificado', 'ZIKV sangue', 'ZIKV urina', 'ZIKV líquido amniótico', 'ZIKV líquido cefalorraquidiano',
  'CHIKV Identificado', 'CHIKV sangue', 'CHIKV urina', 'CHIKV líquido amniótico', 'CHIKV líquido cefalorraquidiano',
  'Assinatura', 'Autor'
  ];

  var resultado = [colunas];

  for (var i = 0; i < laudos.length; i++) {
    var l = laudos[i];
    resultado.push([
      !l.prontuario ? '' : l.prontuario._id,
      l.nome,
      l.dataInicioSintomas,
      l.dataColeta,
      l.dataResultado,
      !l.materialColetado ? '' : l.materialColetado.sa,
      !l.materialColetado ? '' : l.materialColetado.ur,
      !l.materialColetado ? '' : l.materialColetado.la,
      !l.materialColetado ? '' : l.materialColetado.lcr,
      !l.sintomas ? '' : l.sintomas.febre,
      !l.sintomas ? '' : l.sintomas.dorDeCabeca,
      !l.sintomas ? '' : l.sintomas.exantema,
      !l.sintomas ? '' : l.sintomas.conjuntivite,
      !l.sintomas ? '' : l.sintomas.dorCorpo,
      !l.sintomas ? '' : l.sintomas.dorRetroOrbital,
      !l.sintomas ? '' : l.sintomas.dorArticulacoes,
      l.metodologia,
      l.resultado,
      !(l.conclusao && l.conclusao.zikv) ? '' : l.conclusao.zikv.positivo,
      !(l.conclusao && l.conclusao.zikv) ? '' : l.conclusao.zikv.sg,
      !(l.conclusao && l.conclusao.zikv) ? '' : l.conclusao.zikv.ur,
      !(l.conclusao && l.conclusao.zikv) ? '' : l.conclusao.zikv.la,
      !(l.conclusao && l.conclusao.zikv) ? '' : l.conclusao.zikv.lcr,
      !(l.conclusao && l.conclusao.chikv) ? '' : l.conclusao.chikv.positivo,
      !(l.conclusao && l.conclusao.chikv) ? '' : l.conclusao.chikv.sg,
      !(l.conclusao && l.conclusao.chikv) ? '' : l.conclusao.chikv.ur,
      !(l.conclusao && l.conclusao.chikv) ? '' : l.conclusao.chikv.la,
      !(l.conclusao && l.conclusao.chikv) ? '' : l.conclusao.chikv.lcr,
      l.assinatura,
      !l.owner ? '' : l.owner.nome
    ]);
  }

  return resultado;
};

export var questionariosToArray = function(questionarios) {
  var colunas = ['ID', 
                 'Serviço de Saúde.Tipo', 
                 'Serviço de Saúde.Descrição',
                 'Serviço de Saúde.Identificação',
                 'Serviço de Saúde.Município',
                 'Serviço de Saúde.Prontuário',
                 'Serviço de Saúde.Responsável',
                 'Recém Nascido.Data do Parto', 
                 'Recém Nascido.Sexo',
                 'Recém Nascido.Idade Gestacional.Semanas', 
                 'Recém Nascido.Idade Gestacional.Dias',
                 'Recém Nascido.Idade Gestacional.Classificação',
                 'Recém Nascido.Gemelar',
                 'Recém Nascido.Tipo de Parto',
                 'Recém Nascido.Dano Perinatal.Anóxico',
                 'Recém Nascido.Dano Perinatal.Isquêmico',
                 'Recém Nascido.Dano Perinatal.Hemorrágico',
                 'Recém Nascido.Dano Perinatal.Traumático',
                 'Recém Nascido.Dano Perinatal.Outro',
                 'Recém Nascido.Dano Perinatal.Outro Descrição',
                 'Recém Nascido.Exame Físico ao Nascer.Peso',
                 'Recém Nascido.Exame Físico ao Nascer.Estatura',
                 'Recém Nascido.Exame Físico ao Nascer.Perímetro Cefálico',
                 'Recém Nascido.Exame Físico ao Nascer.Perímetro Torácico',
                 'Recém Nascido.Exame Físico ao Nascer.Apgar 1min',
                 'Recém Nascido.Exame Físico ao Nascer.Apgar 5min',
                 'Recém Nascido.Exame Físico ao Nascer.Apgar 10min',
                 'Recém Nascido.Malformações.Possui',
                 'Recém Nascido.Malformações.Aparelho Circulatório',
                 'Recém Nascido.Malformações.Aparelho Respiratório',
                 'Recém Nascido.Malformações.Aparelho Digestório',
                 'Recém Nascido.Malformações.Órgãos Genitais',
                 'Recém Nascido.Malformações.Aparelho Osteomuscular',
                 'Recém Nascido.Malformações.Descrição',
                 'Recém Nascido.Outros Achados Clínicos.Possui',
                 'Recém Nascido.Outros Achados Clínicos.Icterícia',
                 'Recém Nascido.Outros Achados Clínicos.Anemia',
                 'Recém Nascido.Outros Achados Clínicos.Esplenomegalia',
                 'Recém Nascido.Outros Achados Clínicos.Alterações Ósseas',
                 'Recém Nascido.Outros Achados Clínicos.Choro ao Manuseio',
                 'Recém Nascido.Outros Achados Clínicos.Hidropsia',
                 'Recém Nascido.Outros Achados Clínicos.Rinite Mucosanguinolenta',
                 'Recém Nascido.Outros Achados Clínicos.Hepatomegalia',
                 'Recém Nascido.Outros Achados Clínicos.Lesões Cutâneas',
                 'Recém Nascido.Outros Achados Clínicos.Pseudoparalisia',
                 'Recém Nascido.Outros Achados Clínicos.Petéquias',
                 'Recém Nascido.Outros Achados Clínicos.Plaquetopenia',
                 'Recém Nascido.Outros Achados Clínicos.Convulsões',
                 'Recém Nascido.Outros Achados Clínicos.Outras',
                 'Recém Nascido.Hemograma.Primeiro',
                 'Recém Nascido.Hemograma.Data',
                 'Recém Nascido.Hemograma.HB',
                 'Recém Nascido.Hemograma.HT',
                 'Recém Nascido.Hemograma.Leucócitos',
                 'Recém Nascido.Hemograma.Bastonetes',
                 'Recém Nascido.Hemograma.Segmentados',
                 'Recém Nascido.Hemograma.Monócitos',
                 'Recém Nascido.Hemograma.Linfócitos',
                 'Recém Nascido.Hemograma.Plaquetas',
                 'Recém Nascido.Hemograma.Glicose',
                 'Recém Nascido.Hemograma.Idade',
                 'Recém Nascido.Punção Liquórica.Primeiro',
                 'Recém Nascido.Punção Liquórica.Data',
                 'Recém Nascido.Punção Liquórica.Aspecto',
                 'Recém Nascido.Punção Liquórica.Hemácias',
                 'Recém Nascido.Punção Liquórica.Leucócitos',
                 'Recém Nascido.Punção Liquórica.Bastonetes',
                 'Recém Nascido.Punção Liquórica.Segmentados',
                 'Recém Nascido.Punção Liquórica.Monócitos',
                 'Recém Nascido.Punção Liquórica.Linfócitos',
                 'Recém Nascido.Punção Liquórica.Proteínas',
                 'Recém Nascido.Punção Liquórica.Cloreto',
                 'Recém Nascido.Punção Liquórica.Glicose',
                 'Recém Nascido.Punção Liquórica.Idade',
                 'Mãe.Nome',
                 'Mãe.Data de Nascimento',
                 'Mãe.Idade',
                 'Mãe.Raça',
                 'Mãe.Etnia',
                 'Mãe.Escolaridade',
                 'Mãe.Estado Civil',
                 'Mãe.Ocupação',
                 'Mãe.Pessoas que moram na casa',
                 'Mãe.Renda Familiar Mensal',
                 'Mãe.Endereço Atual.Estado',
                 'Mãe.Endereço Atual.Município',
                 'Mãe.Endereço Atual.Logradouro',
                 'Mãe.Endereço Atual.Número',
                 'Mãe.Endereço Atual.Bairro',
                 'Mãe.Endereço Atual.Telefones',
                 'Mãe.Morou em Outro Endereço',
                 'Mãe.Outro Endereço.Estado',
                 'Mãe.Outro Endereço.Município',
                 'Mãe.Outro Endereço.Logradouro',
                 'Mãe.Outro Endereço.Número',
                 'Mãe.Outro Endereço.Bairro',
                 'Mãe.Outro Endereço.Telefones',
                 'Mãe.Doenças Preexistentes.Possui',
                 'Mãe.Doenças Preexistentes.Diabetes',
                 'Mãe.Doenças Preexistentes.Outras Doenças Metabólicas',
                 'Mãe.Doenças Preexistentes.Hipertensão Aterial',
                 'Mãe.Doenças Preexistentes.Cardiopatia Crônica',
                 'Mãe.Doenças Preexistentes.Doença Renal Crônica',
                 'Mãe.Doenças Preexistentes.Pneumopatias Crônicas',
                 'Mãe.Doenças Preexistentes.Hemoglobinopatia',
                 'Mãe.Doenças Preexistentes.Câncer',
                 'Mãe.Doenças Preexistentes.Doença Autoimune',
                 'Mãe.Doenças Preexistentes.Doença Neuroleptica',
                 'Mãe.Doenças Preexistentes.Outras',
                 'Mãe.Tratamentos DST.Possui',
                 'Mãe.Tratamentos DST.HIV',
                 'Mãe.Tratamentos DST.Sífilis',
                 'Mãe.Tratamentos DST.Gonorréia',
                 'Mãe.Tratamentos DST.Clamídia',
                 'Mãe.Tratamentos DST.Hepatites BC',
                 'Mãe.Tratamentos DST.Herpes Simples',
                 'Mãe.Tratamentos DST.Outras',
                 'Mãe.Histórico Obstetrício.Primeira Gestação',
                 'Mãe.Histórico Obstetrício.Quantas Vezes Engravidou',
                 'Mãe.Histórico Obstetrício.Quantos Nascidos Vivos',
                 'Mãe.Histórico Obstetrício.Quantos Nascidos Mortos',
                 'Mãe.Histórico Obstetrício.Já Abortou',
                 'Mãe.Histórico Obstetrício.Quantos Abortos',
                 'Mãe.Histórico Obstetrício.Já Teve Filtros com Má Formação Congênita',
                 'Mãe.Histórico Obstetrício.Quais Filhos com Má Formação Congênita',
                 'Mãe.Histórico Obstetrício.Data de Nascimento do Último Filho',
                 'Mãe.Durante a Gestação.Contato com Pesticida.Teve Contato',
                 'Mãe.Durante a Gestação.Contato com Pesticida.Detalhe',
                 'Mãe.Durante a Gestação.Contato com Agrotóxicos.Teve Contato',
                 'Mãe.Durante a Gestação.Contato com Agrotóxicos.Detalhe',
                 'Mãe.Durante a Gestação.Contato com Produtos Químicos.Teve Contato',
                 'Mãe.Durante a Gestação.Contato com Produtos Químicos.Detalhe',
                 'Mãe.Durante a Gestação.Contato com Raio X.Teve Contato',
                 'Mãe.Durante a Gestação.Contato com Raio X.Primeiro Trimestre',
                 'Mãe.Durante a Gestação.Contato com Raio X.Segundo Trimestre',
                 'Mãe.Durante a Gestação.Contato com Raio X.Terceiro Trimestre',
                 'Mãe.Durante a Gestação.Uso de Medicamentos',
                 'Mãe.Teve Manchas Vermelhas',
                 'Mãe.Hábitos.Uso de Álcool.Fez Uso Durante a Gestação',
                 'Mãe.Hábitos.Uso de Álcool.Frequência Semanal',
                 'Mãe.Hábitos.Uso de Álcool.Doses',
                 'Mãe.Hábitos.Uso de Álcool.Frequência Mais de Três Doses',
                 'Mãe.Hábitos.Tabagismo.Relação com o Cigarro',
                 'Mãe.Hábitos.Tabagismo.Fuma Diariamente Há Quantos Anos',
                 'Mãe.Hábitos.Tabagismo.Parou de Humar Há',
                 'Mãe.Hábitos.Tabagismo.Parou de Humar Há.Unidade de Tempo',
                 'Mãe.Hábitos.Uso de Drogas',
                 'Mãe.Pré-Natal.Realizou Pré-Natal',
                 'Mãe.Pré-Natal.Unidade de Saúde',
                 'Mãe.Pré-Natal.Município',
                 'Mãe.Pré-Natal.Consultas no Primeiro Trimestre',
                 'Mãe.Pré-Natal.Consultas no Segundo Trimestre',
                 'Mãe.Pré-Natal.Consultas no Terceiro Trimestre',
                 'Mãe.Pré-Natal.Data da Primeira Consulta',
                 'Mãe.Pré-Natal.Idade Gestacional na Primeira Consulta',
                 'Mãe.Pré-Natal.Peso no Início da Gestação',
                 'Mãe.Pré-Natal.Peso no Final da Gestação',
                 'Mãe.Pré-Natal.Altura',
                 'Encerramento.Status',
                 'Encerramento.Classificação',
                 'Encerramento.Etiologia Provável',
                 'Encerramento.HD Relacionada',
                 'Encerramento.Evolução',
                 'Encerramento.Data Evolução',
                 'Encerramento.Observações',
                 'Investigador.Data Início da Investigação',
                 'Investigador.Investigador Início',
                 'Investigador.Data Fim da Investigação',
                 'Investigador.Investigador Fim'
                ];

  var resultado = [colunas];
  
  function formataData(data) {
    if (!data) return '';

    data = new Date(data);
    var dia = data.getDate();

    if (dia.toString().length == 1) dia = '0' + dia;

    var mes = data.getMonth() + 1;

    if (mes.toString().length == 1) mes = '0' + mes;

    var ano = data.getFullYear();

    return dia + '/' + mes + '/' + ano;
  }  

  function colunaMedicamentos(q) {
    var medicamentos = [];
    
    if (q && 
        q.mae && 
        q.mae.duranteGestacao && 
        q.mae.duranteGestacao.medicamentos) {
      for (var i = 0; i < q.mae.duranteGestacao.medicamentos.length; i++) {
        var m = q.mae.duranteGestacao.medicamentos[i];
        medicamentos.push(m.nome + ' ' + formataData(m.dataInicioTratamento));
      }
    }

    return medicamentos.join(",");
  }

  function colunaDrogas(q) {
    var drogas = [];
    
    if (q &&
        q.mae &&
        q.mae.habitos &&
        q.mae.habitos.usoDeDrogas) {
      for (var i = 0; i < q.mae.habitos.usoDeDrogas.length; i++) {
        var d = q.mae.habitos.usoDeDrogas[i];
        drogas.push(d.nome + ' ' + d.frequencia);
      }
    }

    return drogas.join(',');
  }

  for (var i = 0; i < questionarios.length; i++) {
    var q = questionarios[i];
    resultado.push([
      q._id,
      q.servicoSaude ? q.servicoSaude.tipo : '',
      q.servicoSaude ? q.servicoSaude.descricao : '',
      q.servicoSaude ? q.servicoSaude.identificacao : '',
      q.servicoSaude ? q.servicoSaude.municipio : '',
      q.servicoSaude ? q.servicoSaude.prontuario : '',
      q.servicoSaude ? q.servicoSaude.responsavel : '',
      q.recemNascido.dataParto,
      q.recemNascido.sexo,
      (q.recemNascido && q.recemNascido.idadeGestacional) ? q.recemNascido.idadeGestacional.semanas : '',
      (q.recemNascido && q.recemNascido.idadeGestacional) ? q.recemNascido.idadeGestacional.dias : '',
      (q.recemNascido && q.recemNascido.idadeGestacional) ? q.recemNascido.idadeGestacional.classificacao : '',
      q.recemNascido ? q.recemNascido.gemelar : '',
      q.recemNascido ? q.recemNascido.tipoParto : '',
      q.recemNascido ? q.recemNascido.danoPerinatalAnoxico : '',
      q.recemNascido ? q.recemNascido.danoPerinatalIsquemico : '',
      q.recemNascido ? q.recemNascido.danoPerinatalHemorragico : '',
      q.recemNascido ? q.recemNascido.danoPerinatalTraumatico : '',
      q.recemNascido ? q.recemNascido.danoPerinatalOutro : '',
      q.recemNascido ? q.recemNascido.outroDanoPerinatal : '',
      q.recemNascido.exameFisicoAoNascer ? q.recemNascido.exameFisicoAoNascer.peso : '',
      q.recemNascido.exameFisicoAoNascer ? q.recemNascido.exameFisicoAoNascer.estatura : '',
      q.recemNascido.exameFisicoAoNascer ? q.recemNascido.exameFisicoAoNascer.perimetroCefalico : '',
      q.recemNascido.exameFisicoAoNascer ? q.recemNascido.exameFisicoAoNascer.perimetroToracico : '',
      q.recemNascido.exameFisicoAoNascer ? q.recemNascido.exameFisicoAoNascer.apgar1Min : '',
      q.recemNascido.exameFisicoAoNascer ? q.recemNascido.exameFisicoAoNascer.apgar5Min : '',
      q.recemNascido.exameFisicoAoNascer ? q.recemNascido.exameFisicoAoNascer.apgar10Min : '',
      q.recemNascido.malformacoes ? q.recemNascido.malformacoes.possui : '',
      q.recemNascido.malformacoes ? q.recemNascido.malformacoes.aparelhoCirculatorio : '',
      q.recemNascido.malformacoes ? q.recemNascido.malformacoes.aparelhoRespiratorio : '',
      q.recemNascido.malformacoes ? q.recemNascido.malformacoes.aparelhoDigestivo : '',
      q.recemNascido.malformacoes ? q.recemNascido.malformacoes.orgaosGenitais : '',
      q.recemNascido.malformacoes ? q.recemNascido.malformacoes.aparelhoOsteomuscular : '',
      q.recemNascido.malformacoes ? q.recemNascido.malformacoes.descricao : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.possui : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.ictericia : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.anemia : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.esplenomegalia : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.alteracoesOsseas : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.choroAoManuseio : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.hidropsia : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.riniteMucoSanguinolenta : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.hepatomegalia : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.lesoesCutaneas : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.pseudoparalisia : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.petequias : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.plaquetopenia : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.convulsoes : '',
      q.recemNascido.outrosAchadosClinicos ? q.recemNascido.outrosAchadosClinicos.outras : '',
      q.recemNascido.hemograma ? q.recemNascido.hemograma.primeiro : '',
      q.recemNascido.hemograma ? q.recemNascido.hemograma.data : '',
      q.recemNascido.hemograma ? q.recemNascido.hemograma.hb : '',
      q.recemNascido.hemograma ? q.recemNascido.hemograma.ht : '',
      q.recemNascido.hemograma ? q.recemNascido.hemograma.leucocitos : '',
      q.recemNascido.hemograma ? q.recemNascido.hemograma.bastonetes : '',
      q.recemNascido.hemograma ? q.recemNascido.hemograma.segmentados : '',
      q.recemNascido.hemograma ? q.recemNascido.hemograma.monocitos : '',
      q.recemNascido.hemograma ? q.recemNascido.hemograma.linfocitos : '',
      q.recemNascido.hemograma ? q.recemNascido.hemograma.plaquetas : '',
      q.recemNascido.hemograma ? q.recemNascido.hemograma.glicose : '',
      q.recemNascido.hemograma ? q.recemNascido.hemograma.idadeRealizacao : '',
      q.recemNascido.puncaoLiquorica ? q.recemNascido.puncaoLiquorica.primeiro : '',
      q.recemNascido.puncaoLiquorica ? q.recemNascido.puncaoLiquorica.data : '',
      q.recemNascido.puncaoLiquorica ? q.recemNascido.puncaoLiquorica.aspecto : '',
      q.recemNascido.puncaoLiquorica ? q.recemNascido.puncaoLiquorica.hemacias : '',
      q.recemNascido.puncaoLiquorica ? q.recemNascido.puncaoLiquorica.leucocitos: '',
      q.recemNascido.puncaoLiquorica ? q.recemNascido.puncaoLiquorica.bastonetes : '',
      q.recemNascido.puncaoLiquorica ? q.recemNascido.puncaoLiquorica.segmentados : '',
      q.recemNascido.puncaoLiquorica ? q.recemNascido.puncaoLiquorica.monocitos : '',
      q.recemNascido.puncaoLiquorica ? q.recemNascido.puncaoLiquorica.linfocitos : '',
      q.recemNascido.puncaoLiquorica ? q.recemNascido.puncaoLiquorica.proteinas : '',
      q.recemNascido.puncaoLiquorica ? q.recemNascido.puncaoLiquorica.cloreto : '',
      q.recemNascido.puncaoLiquorica ? q.recemNascido.puncaoLiquorica.glicose : '',
      q.recemNascido.puncaoLiquorica ? q.recemNascido.puncaoLiquorica.idadeRealizacao : '',
      q.mae ? q.mae.nome : '',
      q.mae ? q.mae.dataDeNascimento : '',
      q.mae ? q.mae.idade : '',
      q.mae ? q.mae.raca : '',
      q.mae ? q.mae.etnia : '',
      q.mae ? q.mae.escolaridade : '',
      q.mae ? q.mae.estadoCivil : '',
      q.mae ? q.mae.ocupacao : '',
      q.mae ? q.mae.pessoasQueMoramNaCasa : '',
      q.mae ? q.mae.rendaFamiliarMensal : '',
      (q.mae && q.mae.enderecoAtual) ? q.mae.enderecoAtual.estado : '',
      (q.mae && q.mae.enderecoAtual) ? q.mae.enderecoAtual.municipio : '',
      (q.mae && q.mae.enderecoAtual) ? q.mae.enderecoAtual.logradouro : '',
      (q.mae && q.mae.enderecoAtual) ? q.mae.enderecoAtual.numero : '',
      (q.mae && q.mae.enderecoAtual) ? q.mae.enderecoAtual.bairro : '',
      (q.mae && q.mae.enderecoAtual) ? q.mae.enderecoAtual.telefones : '',
      q.mae ? q.mae.morouEmOutroEndereco : '',
      (q.mae && q.mae.outroEndereco) ? q.mae.outroEndereco.estado : '',
      (q.mae && q.mae.outroEndereco) ? q.mae.outroEndereco.municipio : '',
      (q.mae && q.mae.outroEndereco) ? q.mae.outroEndereco.logradouro : '',
      (q.mae && q.mae.outroEndereco) ? q.mae.outroEndereco.numero : '',
      (q.mae && q.mae.outroEndereco) ? q.mae.outroEndereco.bairro : '',
      (q.mae && q.mae.outroEndereco) ? q.mae.outroEndereco.telefones : '',
      (q.mae && q.mae.doencasPreexistentes) ? q.mae.doencasPreexistentes.possui : '',
      (q.mae && q.mae.doencasPreexistentes) ? q.mae.doencasPreexistentes.diabetes : '',
      (q.mae && q.mae.doencasPreexistentes) ? q.mae.doencasPreexistentes.outrasDoencasMetabolicas : '',
      (q.mae && q.mae.doencasPreexistentes) ? q.mae.doencasPreexistentes.hipertensaoArterial : '',
      (q.mae && q.mae.doencasPreexistentes) ? q.mae.doencasPreexistentes.cardiopatiaCronica : '',
      (q.mae && q.mae.doencasPreexistentes) ? q.mae.doencasPreexistentes.doencaRenalCronica : '',
      (q.mae && q.mae.doencasPreexistentes) ? q.mae.doencasPreexistentes.pneumopatiasCronicas : '',
      (q.mae && q.mae.doencasPreexistentes) ? q.mae.doencasPreexistentes.hemoglobinopatia : '',
      (q.mae && q.mae.doencasPreexistentes) ? q.mae.doencasPreexistentes.cancer : '',
      (q.mae && q.mae.doencasPreexistentes) ? q.mae.doencasPreexistentes.doencaAutoImune : '',
      (q.mae && q.mae.doencasPreexistentes) ? q.mae.doencasPreexistentes.doencaNeuroleptica : '',
      (q.mae && q.mae.doencasPreexistentes) ? q.mae.doencasPreexistentes.outras : '',
      (q.mae && q.mae.tratamentosDST) ? q.mae.tratamentosDST.possui : '',
      (q.mae && q.mae.tratamentosDST) ? q.mae.tratamentosDST.hiv : '',
      (q.mae && q.mae.tratamentosDST) ? q.mae.tratamentosDST.sifilis : '',
      (q.mae && q.mae.tratamentosDST) ? q.mae.tratamentosDST.gonorreia : '',
      (q.mae && q.mae.tratamentosDST) ? q.mae.tratamentosDST.clamidia : '',
      (q.mae && q.mae.tratamentosDST) ? q.mae.tratamentosDST.hepatitesBC : '',
      (q.mae && q.mae.tratamentosDST) ? q.mae.tratamentosDST.herpesSimples : '',
      (q.mae && q.mae.tratamentosDST) ? q.mae.tratamentosDST.outras : '',
      (q.mae && q.mae.historicoObstetricio) ? q.mae.historicoObstetricio.primeiraGestacao : '',
      (q.mae && q.mae.historicoObstetricio) ? q.mae.historicoObstetricio.quantasVezesEngravidou : '',
      (q.mae && q.mae.historicoObstetricio) ? q.mae.historicoObstetricio.quantosNascimentosVivos : '',
      (q.mae && q.mae.historicoObstetricio) ? q.mae.historicoObstetricio.quantosNascidosMortos : '',
      (q.mae && q.mae.historicoObstetricio) ? q.mae.historicoObstetricio.jaAbortou : '',
      (q.mae && q.mae.historicoObstetricio) ? q.mae.historicoObstetricio.quantosAbortos : '',
      (q.mae && q.mae.historicoObstetricio) ? q.mae.historicoObstetricio.jaTeveFilhosComMalFormacaoCongenita : '',
      (q.mae && q.mae.historicoObstetricio) ? q.mae.historicoObstetricio.quaisFilhosComMalFormacaoCongenita : '',
      (q.mae && q.mae.historicoObstetricio) ? q.mae.historicoObstetricio.dataNascimentoUltimoFilho : '',
      q.mae.duranteGestacao.contatoComPesticidas ? q.mae.duranteGestacao.contatoComPesticidas.teveContato : '',
      q.mae.duranteGestacao.contatoComPesticidas ? q.mae.duranteGestacao.contatoComPesticidas.detalhe : '',
      q.mae.duranteGestacao.contatoComAgrotoxicos ? q.mae.duranteGestacao.contatoComAgrotoxicos.teveContato : '',
      q.mae.duranteGestacao.contatoComAgrotoxicos ? q.mae.duranteGestacao.contatoComAgrotoxicos.detalhe : '',
      q.mae.duranteGestacao.contatoComProdutoQuimico ? q.mae.duranteGestacao.contatoComProdutoQuimico.teveContato : '',
      q.mae.duranteGestacao.contatoComProdutoQuimico ? q.mae.duranteGestacao.contatoComProdutoQuimico.detalhe : '',
      q.mae.duranteGestacao.contatoComRaioX ? q.mae.duranteGestacao.contatoComRaioX.teveContato : '',
      q.mae.duranteGestacao.contatoComRaioX ? q.mae.duranteGestacao.contatoComRaioX.primeiroTrimestre : '',
      q.mae.duranteGestacao.contatoComRaioX ? q.mae.duranteGestacao.contatoComRaioX.segundoTrimestre : '',
      q.mae.duranteGestacao.contatoComRaioX ? q.mae.duranteGestacao.contatoComRaioX.terceiroTrimestre : '',
      colunaMedicamentos(q),
      q.mae.teveManchasVermelhas,
      q.mae.habitos.usoDeAlcool ? q.mae.habitos.usoDeAlcool.fezUsoDuranteGestacao : '',
      q.mae.habitos.usoDeAlcool ? q.mae.habitos.usoDeAlcool.frequenciaSemanal : '',
      q.mae.habitos.usoDeAlcool ? q.mae.habitos.usoDeAlcool.doses : '',
      q.mae.habitos.usoDeAlcool ? q.mae.habitos.usoDeAlcool.frequenciaMaisDeTresDoses : '',
      q.mae.habitos.tabagismo ? q.mae.habitos.tabagismo.relacaoComCigarro : '',
      q.mae.habitos.tabagismo ? q.mae.habitos.tabagismo.fumaDiariamenteHaQuantosAnos : '',
      q.mae.habitos.tabagismo ? q.mae.habitos.tabagismo.parouDeFumarHa : '',
      q.mae.habitos.tabagismo ? q.mae.habitos.tabagismo.parouDeFumarUnidadeDeTempo : '',
      colunaDrogas(q),
      q.mae.prenatal ? q.mae.prenatal.realizouPreNatal : '',
      q.mae.prenatal ? q.mae.prenatal.unidadeDeSaude : '',
      q.mae.prenatal ? q.mae.prenatal.municipio : '',
      q.mae.prenatal ? q.mae.prenatal.consultasPrimeiroTrimestre : '',
      q.mae.prenatal ? q.mae.prenatal.consultasSegundoTrimestre : '',
      q.mae.prenatal ? q.mae.prenatal.consultasTerceiroTrimestre : '',
      q.mae.prenatal ? q.mae.prenatal.dataPrimeiraConsulta : '',
      q.mae.prenatal ? q.mae.prenatal.idadeGestacionalPrimeiraConsulta : '',
      q.mae.prenatal ? q.mae.prenatal.pesoInicioGestacao : '',
      q.mae.prenatal ? q.mae.prenatal.pesoFinalGestacao : '',
      q.mae.prenatal ? q.mae.prenatal.altura : '',
      q.encerramentoCaso ? q.encerramentoCaso.statusInvestigacao : '',
      q.encerramentoCaso ? q.encerramentoCaso.classificacaoFinal : '',
      q.encerramentoCaso ? q.encerramentoCaso.etiologiaProvavel : '',
      q.encerramentoCaso ? q.encerramentoCaso.hdRelacionada : '',
      q.encerramentoCaso ? q.encerramentoCaso.evolucao : '',
      q.encerramentoCaso ? q.encerramentoCaso.dataEvolucao : '',
      q.encerramentoCaso ? q.encerramentoCaso.observacoes : '',
      q.investigador ? q.investigador.inicioInvestigacao : '',
      q.investigador ? q.investigador.investigadorInicio : '',
      q.investigador ? q.investigador.fimInvestigacao : '',
      q.investigador ? q.investigador.investigadorFim : ''
    ]);
  }

  return resultado;
};

export var prontuariosToArray = function(prontuarios) {
  var colunas = ['ID', 'Nome da mãe', 'Local do acompanhamento', 'endereço', 'cidade', 'ponto de referência', 'telefone',
  'telefone de contato', 'data de nascimento', 'gestações', 'nascimentos', 'abortos', 'peso da mãe', 'altura da mãe',
  'primeira ultrassom', 'última ultrassom', 'idade gestacional na admissão do projeto', 
  'História da Exantema', 'Exantema Trimestre', 'Exantema Mês', 'Exantema Idade Gestacional Mês', 'Exantema Idade Gestacional Trimestre',
  'Nome da criança', 'Data de nascimento da criança', 'Tipo de parto', 'Idade gestacional parto', 'Condição de nascimento', 'Má formação',
  'Peso da criança', 'Estatura da criança', 'PC', 'Apgar 1 min', 'Apgar 5 min', 'Autor'
  ];

  var resultado = [colunas];

  for (var i = 0; i < prontuarios.length; i++) {
    var p = prontuarios[i];
    resultado.push(
      [
        p._id,
        !p.mae ? '' : p.mae.nome,
        !p.mae ? '' : p.mae.localAcompanhamento,
        !p.mae ? '' : p.mae.endereco,
        !p.mae ? '' : p.mae.cidade,
        !p.mae ? '' : p.mae.pontoDeReferencia,
        !p.mae ? '' : p.mae.telefone,
        !p.mae ? '' : p.mae.telefoneContato,
        !p.mae ? '' : p.mae.dataDeNascimento,
        !p.mae ? '' : p.mae.gestacoes,
        !p.mae ? '' : p.mae.nascimentos,
        !p.mae ? '' : p.mae.abortos,
        !p.mae ? '' : p.mae.peso,
        !p.mae ? '' : p.mae.altura,
        !p.mae ? '' : p.mae.primeiraUltrassom,
        !p.mae ? '' : p.mae.ultimaUltrassom,
        !p.mae ? '' : p.mae.idadeGestacionalAdmissaoProjeto,   
        !(p.mae && p.mae.enxatema) ? '' : p.mae.enxatema.historiaEnxatema,
        !(p.mae && p.mae.enxatema) ? '' : p.mae.enxatema.trimestre,
        !(p.mae && p.mae.enxatema) ? '' : p.mae.enxatema.mes,
        !(p.mae && p.mae.enxatema) ? '' : p.mae.enxatema.idadeGestacionalEnxatemaMes,
        !(p.mae && p.mae.enxatema) ? '' : p.mae.enxatema.idadeGestacionalEnxatemaTrimestre,
        !p.crianca ? '' : p.crianca.nome,
        !p.crianca ? '' : p.crianca.dataDeNascimento,
        !p.crianca ? '' : p.crianca.tipoDeParto,
        !p.crianca ? '' : p.crianca.idadeGestacionalParto,
        !p.crianca ? '' : p.crianca.condicaoNascimento,
        !p.crianca ? '' : p.crianca.maFormacao,
        !p.crianca ? '' : p.crianca.peso,
        !p.crianca ? '' : p.crianca.estatura,
        !p.crianca ? '' : p.crianca.pc,
        !p.crianca ? '' : p.crianca.apgar1M,
        !p.crianca ? '' : p.crianca.apgar5M,
        !p.owner ? '' : p.owner.nome
      ]);
  }

  return resultado;
};

export var examesToArray = function(exames) {
  var colunas = ['ID do Prontuário', 'Nome da mãe', 'Nome da criança', 'Tipo do Exame', 'Data', 'Idade gestacional',
  'Local', 'Imagem salva', 'Redução volumétrica', 'Paquigiria', 'Lisencefalia', 'Ventriculomegalia',
  'Hidrocefalia', 'Ventriculomegalia severa', 'Calficações', 'Local das calcificações', 'Corpo caloso',
  'Malformações císticas', 'Local dos cistos', 'Hipoplasia do cerebelo', 'Hipoplasia do vermis',
  'Hipoplasia do tronco', 'Hipoplasia da ponte', 'Hipoplasia do hipotálamo', 'Redução das fontanelas',
  'Autor'];

  var resultado = [colunas];

  for (var i = 0; i < exames.length; i++) {
    var e = exames[i];
    if (e.prontuario) {
      resultado.push(
        [
          e.prontuario._id,
          !e.prontuario.mae ? '' : e.prontuario.mae.nome,
          !e.prontuario.crianca ? '' : e.prontuario.crianca.nome,
          e.nome,
          e.data,
          e.idadeGestacional,
          e.local,
          e.imagemSalva,
          e.reducaoVolumetrica,
          e.paquigiria,
          e.lisencefalia,
          e.ventriculomegalia,
          e.hidrocefalia,
          e.ventriculomegaliaSevera,
          e.calcificacoes,
          e.localDasCalcificacoes,
          e.corpoCaloso,
          e.malformacoesCisticas,
          e.localCistos,
          e.hipoplasiaDoCerebelo,
          e.hipoplasiaDoVermis,
          e.hipoplasiaDoTronco,
          e.hipoplasiaDaPonte,
          e.hipoPlasiaDoHipotalamo,
          e.reducaoDasFontanelas,
          !e.owner ? '' : e.owner.nome
        ]);
    }
  }

  return resultado;
};

export var gmfmsToArray = function(gmfms)  {
  var colunas = ['ID do Prontuário', 'Nome da mãe', 'Nome da criança', 'Data', 'Nível I', 'Nível II', 'Nível III', 'Nível IV', 'Nível V',
  'Score 88', 'Dimensão A', 'Dimensão B', 'Dimensão C', 'Dimensão D', 'Dimensão E', 'Score 66',
  'Erro padrão', 'Índice de Confiança', 'Autor'];

  var resultado = [colunas];

  for (var i = 0; i < gmfms.length; i++) {
    var g = gmfms[i];
    if (g.prontuario) {
      resultado.push([
        g.prontuario._id,
        g.prontuario.mae ? '' : g.prontuario.mae.nome,
        g.prontuario.crianca ? '' : g.prontuario.crianca.nome,
        g.data,
        g.nivelI,
        g.nivelII,
        g.nivelIII,
        g.nivelIV,
        g.nivelV,
        g.score88,
        g.dimensaoA,
        g.dimensaoB,
        g.dimensaoC,
        g.dimensaoD,
        g.dimensaoE,
        g.score66,
        g.erroPadrao,
        g.indiceDeConfianca,
        !g.owner ? '' : g.owner.nome      
      ]);
    }
  }

  return resultado;
};

export default Excel;
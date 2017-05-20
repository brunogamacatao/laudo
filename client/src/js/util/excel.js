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
    resultado.push(
      [
        e.prontuario._id,
        e.prontuario.mae.nome,
        e.prontuario.crianca.nome,
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

  return resultado;
};

export var gmfmsToArray = function(gmfms)  {
  var colunas = ['ID do Prontuário', 'Nome da mãe', 'Nome da criança', 'Data', 'Nível I', 'Nível II', 'Nível III', 'Nível IV', 'Nível V',
  'Score 88', 'Dimensão A', 'Dimensão B', 'Dimensão C', 'Dimensão D', 'Dimensão E', 'Score 66',
  'Erro padrão', 'Índice de Confiança', 'Autor'];

  var resultado = [colunas];

  for (var i = 0; i < gmfms.length; i++) {
    var g = gmfms[i];

    resultado.push([
      g.prontuario._id,
      g.prontuario.mae.nome,
      g.prontuario.crianca.nome,
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

  return resultado;
};

export default Excel;
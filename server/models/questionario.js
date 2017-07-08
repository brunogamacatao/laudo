var mongoose = require('mongoose');

var ServicoSaudeSchema = new mongoose.Schema({
  tipo: String,
  descricao: String,
  identificacao: String,
  municipio: String,
  prontuario: String,
  responsavel: String
});

var IdadeGestacionalSchema = new mongoose.Schema({
  semanas: Number,
  dias: Number,
  classificacao: String  
});

var ExameFisicoAoNascerSchema = new mongoose.Schema({
  peso: Number,
  estatura: Number,
  perimetroCefalico: Number,
  perimetroToracico: Number,
  apgar1Min: Number,
  apgar5Min: Number,
  apgar10Min: Number
});

var MalformacoesSchema = new mongoose.Schema({
  possui: Boolean,
  aparelhoCirculatorio: Boolean,
  aparelhoRespiratorio: Boolean,
  aparelhoDigestivo: Boolean,
  orgaosGenitais: Boolean,
  aparelhoOsteomuscular: Boolean,
  descricao: String
});

var OutrosAchadosClinicosSchema = new mongoose.Schema({
  possui: Boolean,
  ictericia: Boolean,
  anemia: Boolean,
  esplenomegalia: Boolean,
  alteracoesOsseas: Boolean,
  choroAoManuseio: Boolean,
  hidropsia: Boolean,
  riniteMucoSanguinolenta: Boolean,
  hepatomegalia: Boolean,
  lesoesCutaneas: Boolean,
  pseudoparalisia: Boolean,
  petequias: Boolean,
  plaquetopenia: Boolean,
  convulsoes: Boolean,
  outras: String
});

var HemogramaSchema = new mongoose.Schema({
  primeiro: Boolean,
  data: Date,
  hb: Number,
  ht: Number,
  leucocitos: Number,
  bastonetes: Number,
  segmentados: Number,
  monocitos: Number,
  linfocitos: Number,
  plaquetas: Number,
  glicose: Number,
  idadeRealizacao: Number
});

var PuncaoLiquoricaSchema = new mongoose.Schema({
  primeiro: Boolean,
  data: Date,
  aspecto: String,
  hemacias: Number,
  leucocitos: Number,
  bastonetes: Number,
  segmentados: Number,
  monocitos: Number,
  linfocitos: Number,
  proteinas: Number,
  cloreto: Number,
  glicose: Number,
  idadeRealizacao: Number
});

var DadosExameSchema = new mongoose.Schema({
  amostra: String,
  data: Date,
  igm: Number,
  igg: Number,
  pcr: Number
});

var ExameEtiologicoSchema = new mongoose.Schema({
  agente: String,
  dados: [DadosExameSchema]
});

var ExameCranianoSchema = new mongoose.Schema({
  possui: Boolean,
  nome: String,
  data: Date,
  normal: Boolean,
  calcificacoes: Boolean,
  lisencefalia: Boolean,
  atrofiaCerebral: Boolean,
  ventriculomegalia: Boolean,
  suturasCalcificadas: Boolean,
  outras: String
});

var ExameSchema = new mongoose.Schema({
  possui: Boolean,
  nome: String,
  data: Date,
  alteracao: Boolean,
  descricao: String
});

var RecemNascidoSchema = new mongoose.Schema({
  dataParto: Date,
  sexo: String,
  idadeGestacional: IdadeGestacionalSchema,
  gemelar: String,
  tipoParto: String,
  danoPerinatalAnoxico: Boolean,
  danoPerinatalIsquemico: Boolean,
  danoPerinatalHemorragico: Boolean,
  danoPerinatalTraumatico: Boolean,
  danoPerinatalOutro: Boolean,
  outroDanoPerinatal: String,
  exameFisicoAoNascer: ExameFisicoAoNascerSchema,
  malformacoes: MalformacoesSchema,
  outrosAchadosClinicos: OutrosAchadosClinicosSchema,
  hemograma: HemogramaSchema,
  puncaoLiquorica: PuncaoLiquoricaSchema,
  examesEtiologicos: [ExameEtiologicoSchema],
  examesCranianos: [ExameCranianoSchema],
  exames: [ExameSchema]
});

var EnderecoSchema = new mongoose.Schema({
  estado: String,
  municipio: String,
  logradouro: String,
  numero: String,
  bairro: String,
  telefones: String
});

var ViagemSchema = new mongoose.Schema({
  dataDeIda: Date,
  dataDeVolta: Date,
  pais: String,
  estado: String,
  municipio: String
});

var AntecedenteSchema = new mongoose.Schema({
  antecedente: String,
  possui: Boolean,
  descricao: String
});

var DoencaPreexistenteSchema = new mongoose.Schema({
  possui: Boolean,
  diabetes: Boolean,
  outrasDoencasMetabolicas: Boolean,
  hipertensaoAterial: Boolean,
  cardiopatiaCronica: Boolean,
  doencaRenalCronica: Boolean,
  pneumopatiasCronicas: Boolean,
  hemoglobinopatia: Boolean,
  cancer: Boolean,
  doencaAutoImune: Boolean,
  doencaNeuroleptica: Boolean,
  outras: String
});

var TratamentoDSTSchema = new mongoose.Schema({
  possui: Boolean,
  hiv: Boolean,
  sifilis: Boolean,
  gonorreia: Boolean,
  clamidia: Boolean,
  hepatitesBC: Boolean,
  herpesSimples: Boolean,
  outras: String
});

var HistoricoObstetricioSchema = new mongoose.Schema({
  primeiraGestacao: Boolean,
  quantasVezesEngravidou: Number,
  quantosNascidosVivos: Number,
  quantosNascidosMortos: Number,
  jaAbortou: Boolean,
  quantosAbortos: Number,
  jaTeveFilhosComMalFormacaoCongenita: Boolean,
  quaisFilhosComMalFormacaoCongenita: String,
  dataNascimentoUltimoFilho: Date
});

var ContatoSubstanciaSchema = new mongoose.Schema({
  teveContato: Boolean,
  detalhe: String
});

var ContatoRaioXSchema = new mongoose.Schema({
  teveContato: Boolean,
  primeiroTrimestre: Boolean,
  segundoTrimestre: Boolean,
  terceiroTrimestre: Boolean
});

var UsoDeMedicamentoSchema = new mongoose.Schema({
  nome: String,
  dataInicioTratamento: Date
});

var DuranteGestacaoSchema = new mongoose.Schema({
  contatoComPesticidas: ContatoSubstanciaSchema,
  contatoComAgrotoxicos: ContatoSubstanciaSchema,
  contatoProdutoQuimico: ContatoSubstanciaSchema,
  contatoRaioX: ContatoRaioXSchema,
  medicamentos: [UsoDeMedicamentoSchema]
});

var HistoricoManchasVermelhasSchema = new mongoose.Schema({
  trimestre: Number,
  apresentouManchas: Boolean,
  dataInicioEnxatema: Date,
  duracaoEmDias: Number,
  localDeInicio: String,
  espalhou: Boolean,
  espalhouParaOnde: String,
  febre: Boolean,
  febreTemperatura: Number,
  prurido: Boolean,
  tosse: Boolean,
  coriza: Boolean,
  cefaleia: Boolean,
  mialgia: Boolean,
  artralgia: Boolean,
  artralgiaTempo: Number,
  linfoadenopatia: Boolean,
  hiperemiaConjuntival: Boolean,
  vomitos: Boolean,
  dorRetroorbital: Boolean,
  outros: String,
  surgimentoDoRash: String,
  atendimentoMedico: Boolean,
  hipoteseDiagnostica: String,
  tomouRemedio: Boolean,
  remedios: String
});

var UsoDeAlcoolSchema = new mongoose.Schema({
  fezUsoDuranteGestacao: Boolean,
  frequenciaSemanal: String,
  doses: String,
  frequenciaMaisDeTresDoses: String
});

var TabagismoSchema = new mongoose.Schema({
  relacaoComCigarro: String,
  fumaDiariamenteHaQuantosAnos: Number,
  parouDeFumarHa: Number,
  parouDeFumarUnidadeDeTempo: String
});

var DrogasIlicitasSchema = new mongoose.Schema({
  nome: String,
  frequencia: String
});

var HabitosSchema = new mongoose.Schema({
  usoDeAlcool: UsoDeAlcoolSchema,
  tabagismo: TabagismoSchema,
  usoDeDrogas: [DrogasIlicitasSchema]
});

var VacinaSchema = new mongoose.Schema({
  nome: String,
  numeroDeDoses: Number,
  dataDoses: [Date]
});

var ComplicacoesSchema = new mongoose.Schema({
  teveComplicacoes: Boolean,
  infeccaoTratoUrinario: Boolean,
  anemia: Boolean,
  diabetesGestacional: Boolean,
  hipertensaoAterial: Boolean,
  preeclampsia: Boolean,
  placentaPrevia: Boolean,
  oligodramnio: Boolean,
  polidramnio: Boolean,
  insuficienciaColoUterino: Boolean,
  hiperemeseGravitica: Boolean,
  anomaliasAnatomicasUtero: Boolean,
  deslocamentoPlacenta: Boolean,
  crescimentoIntrauterinoRestrito: Boolean,
  incisura: Boolean,
  outras: String
});

var UltrassomSchema = new mongoose.Schema({
  data: Date,
  idadeGestacional: Number,
  perimetroCefalico: Number,
  microcefalia: Boolean,
  calcificacoes: Boolean,
  ventriculomegalia: Boolean,
  outrosAchados: String,
  dbp: Number,
  femur: Number,
  circunferenciaAbdominal: Number,
  peso: Number
});

var ResultadoExamePreNatalSchema = new mongoose.Schema({
  realizado: Boolean,
  data: Date,
  resultado: String
});

var ExamePreNatalSchema = new mongoose.Schema({
  nome: String,
  primeiroTrimestre: ResultadoExamePreNatalSchema,
  segundoTrimestre: ResultadoExamePreNatalSchema,
  terceiroTrimestre: ResultadoExamePreNatalSchema
});

var DoencasInfectoContagiosasSchema = new mongoose.Schema({
  trimestre: Number,
  toxoplasmose: Boolean,
  rubeola: Boolean,
  citomegalovirus: Boolean,
  sifilis: Boolean,
  herpesSimples: Boolean,
  parvovirus: Boolean,
  hiv: Boolean,
  dengue: Boolean,
  chikungunya: Boolean,
  zikaVirus: Boolean,
  outras: String
});

var VRDLSifilisSchema = new mongoose.Schema({
  titulo: String,
  recebeuTratamento: Boolean,
  dataInicioTratamento: Date,
  parceiroTratadoConcomitante: Boolean
});

var PreNatalSchema = new mongoose.Schema({
  realizouPreNatal: Boolean,
  unidadeDeSaude: String,
  municipio: String,
  consultasPrimeiroTrimestre: Number,
  consultasSegundoTrimestre: Number,
  consultasTerceiroTrimestre: Number,
  dataPrimeiraConsulta: Date,
  idadeGestacionalPrimeiraConsulta: Number,
  pesoInicioGestacao: Number,
  pesoFinalGestacao: Number,
  altura: Number,
  historicoVacinal: [VacinaSchema],
  complicacoes: ComplicacoesSchema,
  examesUltrassom: [UltrassomSchema],
  exames: [ExamePreNatalSchema],
  diagnosticoDoencasInfectoContagiosas: Boolean,
  doencasInfectoContagiosas: [DoencasInfectoContagiosasSchema],
  vrdl: [VRDLSifilisSchema]
});

var MaeSchema = new mongoose.Schema({
  nome: String,
  dataDeNascimento: Date,
  idade: Number,
  raca: String,
  etnia: String,
  escolaridade: String,
  estadoCivil: String,
  ocupacao: String,
  pessoasQueMoramNaCasa: Number,
  rendaFamiliarMensal: Number,
  enderecoAtual: EnderecoSchema,
  morouEmOutroEndereco: Boolean,
  outroEndereco: EnderecoSchema,
  viagens: [ViagemSchema],
  antecedentes: [AntecedenteSchema],
  doencasPreexistentes: DoencaPreexistenteSchema,
  tratamentosDST: TratamentoDSTSchema,
  historicoObstetricio: HistoricoObstetricioSchema,
  duranteGestacao: DuranteGestacaoSchema,
  teveManchasVermelhas: Boolean,
  historicoManchasVermelhas: [HistoricoManchasVermelhasSchema],
  habitos: HabitosSchema,
  prenatal: PreNatalSchema
});

var EncerramentoCasoSchema = new mongoose.Schema({
  statusInvestigacao: String,
  classificacaoFinal: String,
  etiologiaProvavel: String,
  hdRelacionada: String,
  evolucao: String,
  dataEvolucao: Date,
  observacoes: String
});

var InvestigadorSchema = new mongoose.Schema({
  inicioInvestigacao: Date,
  investigadorInicio: String,
  fimInvestigacao: Date,
  investigadorFim: String
});

var QuestionarioSchema = new mongoose.Schema({
  servicoSaude: ServicoSaudeSchema,
  recemNascido: RecemNascidoSchema,
  mae: MaeSchema,
  encerramentoCaso: EncerramentoCasoSchema,
  investigador: InvestigadorSchema,
  createdAt: Date,
  updatedAt: Date,
  prontuario: {
    type: mongoose.Schema.ObjectId,
    ref: 'Prontuario'
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }  
});

QuestionarioSchema.pre('save', function(next) {
  var now = new Date();

  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

mongoose.model('Questionario', QuestionarioSchema);
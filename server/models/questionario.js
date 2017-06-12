var mongoose = require('mongoose');

var ServicoSaudeSchema = new mongoose.Schema({
  tipo: String,
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
  glicose: Number
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
  glicose: Number
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
  danoPerinatal: String,
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
  trimestre: Number
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
  tabegismo: TabagismoSchema,
  usoDeDrogas: [DrogasIlicitasSchema]
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
  historicoManchasVermelhas: [HistoricoManchasVermelhasSchema],
  habitos: HabitosSchema
});

var QuestionarioSchema = new mongoose.Schema({
  servicoSaude: ServicoSaudeSchema,
  recemNascido: RecemNascidoSchema,
  mae: MaeSchema
});

mongoose.model('Questionario', QuestionarioSchema);
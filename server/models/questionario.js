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

var QuestionarioSchema = new mongoose.Schema({
  servicoSaude: ServicoSaudeSchema,
  recemNascido: RecemNascidoSchema
});

mongoose.model('Questionario', QuestionarioSchema);
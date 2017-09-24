// Imports gerais
import express      from 'express';
import compression  from 'compression';
import path         from 'path';
import favicon      from 'serve-favicon';
import logger       from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser   from 'body-parser';
import constantes   from './config/constantes';

// Autenticação
import User from './models/user';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { jwtSecret, masterKey } from './config/constantes'

/**
 * Criação de uma classe responsável por configurar e inicar a aplicação.
 */ 
var Aplicacao = function() {
  this.app = express();

  this.setupMiddleware();
  this.setupAuthentication();
};

Aplicacao.prototype.inDevelopment = function() {
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    return false;
  }

  return true;
};

/**
 * Configuração das rotas da aplicação
 */
Aplicacao.prototype.setupRoutes = function() {
  // Rotas
  this.app.use('/user', require('./routes/user'));
  this.app.use('/prontuarios', require('./routes/prontuarios'));
};

/**
 * Configuração do middleware da aplicação.
 * Um middleware é uma lista de funções que são chamadas, sem sequência, para
 * cada request. Uma função do middleware pode modificar o request, enviar dados
 * para o response, ou delegar o processamento para a função seguinte (next).
 */
Aplicacao.prototype.setupMiddleware = function() {
  // Em primeiro lugar é feito o tratamento geral das requisições
  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  this.app.use(logger('dev'));
  this.app.use(bodyParser.json());
  this.app.use(bodyParser.urlencoded({ extended: false }));
  this.app.use(cookieParser());

  // Configuração da segurança
  var expressSession = require('express-session');
  var sessionParams = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 60000000,
      _expires : 60000000
    }
  };
  this.app.use(expressSession(sessionParams));
  this.app.use(passport.initialize());
  this.app.use(passport.session());

  // Em seguida, são chamadas as rotas da aplicação
  this.setupRoutes();

  // Recursos estáticos
  this.app.use(compression()); // Ligar a compressão gzip
  this.app.use(express.static(path.join(__dirname, constantes.STATICS_PATH)));
  this.app.use(express.static(path.join(__dirname, constantes.TEMPLATES_PATH)));
  this.app.use(express.static(path.join(__dirname, constantes.ASSETS_PATH)));


  // Caso nenhuma rota atenda a requisição, as funções de erro são executadas
  this.app.use(this.pageForFoundErrorHandler.bind(this));
  this.app.use(this.generalErrorHandler.bind(this));
};

/**
 * Configuração da autenticação da aplicação
 */
Aplicacao.prototype.setupAuthentication = function() {
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  passport.use('token', new JwtStrategy({
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromUrlQueryParameter('access_token'),
      ExtractJwt.fromBodyField('access_token'),
      ExtractJwt.fromAuthHeaderWithScheme('Bearer')
    ])
  }, ({ id }, done) => {
    User.findById(id).then((user) => {
      done(null, user)
      return null
    }).catch(done)
  }));
  
};

export const token = ({ required, admin } = {}) => (req, res, next) =>
  passport.authenticate('token', { session: false }, (err, user, info) => {
    if (err || (required && !user) || (required && admin && !user.admin)) {
      return res.status(401).end()
    }

    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(401).end()
      next()
    })
  })(req, res, next);

Aplicacao.prototype.pageForFoundErrorHandler = function(err, req, res, next) {
  // catch 404 and forward to error handler
  this.app.use(function(req, res, next) {
    var err = new Error('Página não encontrada');
    err.status = 404;
    next(err);
  });  
};

Aplicacao.prototype.generalErrorHandler = function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: err, message: err.message, stack: err.stack});  
};

export default Aplicacao;

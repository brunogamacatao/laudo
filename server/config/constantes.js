import path from 'path'
import _ from 'lodash'

const constantes = {
  DATABASE_URL_DEV: 'mongodb://localhost/laudo',
  DATABASE_URL_PROD: 'mongodb://heroku_wkb9m7x7:ia454oarn83kq4p4vml4vhk0tf@ds149059.mlab.com:49059/heroku_wkb9m7x7',
  VIEW_ENGINE: 'ejs',
  VIEWS_PATH: '../client/dist',
  STATICS_PATH: '../client/dist',
  STATICS_SRC_PATH: '../client/src',
  TEMPLATES_PATH: '../client/templates',
  ASSETS_PATH: '../client/assets'
};

// Escolhe automaticamente a conexão com o banco de dados de acordo com o 
// ambiente de execução (produção ou desenvolvimento)
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  constantes.DATABASE_URL = constantes.DATABASE_URL_PROD;
} else {
  constantes.DATABASE_URL = constantes.DATABASE_URL_DEV;
}

const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe')
  dotenv.load({
    path: path.join(__dirname, '../.env'),
    sample: path.join(__dirname, '../.env.example')
  })
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 9000,
    ip: process.env.IP || '0.0.0.0',
    defaultEmail: 'no-reply@myrest.com',
    sendgridKey: requireProcessEnv('SENDGRID_KEY'),
    masterKey: requireProcessEnv('MASTER_KEY'),
    jwtSecret: requireProcessEnv('JWT_SECRET'),
    mongo: {
      options: {
        db: {
          safe: true
        }
      }
    }
  },
  test: {
    mongo: {
      uri: 'mongodb://localhost/myrest-test',
      options: {
        debug: false
      }
    }
  },
  development: {
    mongo: {
      uri: 'mongodb://localhost/myrest-dev',
      options: {
        debug: true
      }
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost/myrest'
    }
  }
}

module.exports = _.merge(constantes, config.all, config[config.all.env])
export default module.exports

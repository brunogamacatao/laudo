#!/usr/bin/env node

import Servidor from './servidor';
import Aplicacao from './aplicacao';
import BancoDeDados from './banco_de_dados';

// Tenta se conectar ao banco de dados
new BancoDeDados(function() {
  // Se a conexão for um sucesso, cria e inicia o servidor para a aplicação
  new Servidor(new Aplicacao().app).start();  
});

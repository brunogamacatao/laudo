import angular from 'angular';

import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import fontkit from 'fontkit';

// Cria o módulo
const controllers = angular.module('ipesq.controllers', []);

// Cria os controladores
controllers.controller('MainController', ['$scope', function($scope) {
  function novoLaudo() {
    return {
      dataResultado: new Date(),
      materialColetado: {},
      resultado: null,
      conclusao: {
        zikv: {},
        chikv: {}
      }
    };
  }

  $scope.laudo = novoLaudo();

  $scope.emitir = function() {
    console.log($scope.laudo);

    let pad = (number, size) => {
      var s = String(number);

      while (s.length < (size || 2)) {
        s = '0' + s;
      }

      return s;
    };

    let formatDate = (date) => {
      return pad(date.getDate()) + '/' + pad(date.getMonth()) + '/' + date.getFullYear();
    };

    let doc = new PDFDocument();
    let stream = doc.pipe(blobStream());

    function toBuffer(ab) {
      var buf = new Buffer(ab.byteLength);
      var view = new Uint8Array(ab);

      for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
      }

      return buf;
    }

    console.log('Loading the font ...');
    fetch('fonts/Roboto-Regular.ttf')
      .then(response => response.arrayBuffer())
      .then(font => {
        // Gambiarra
        fontkit.openSync = (filename, postscriptName) => {
          return fontkit.create(toBuffer(font), postscriptName);
        };
      })
      .then(() => {
      console.log('Done');

      doc.font('fonts/Roboto-Regular.ttf');

      // Add content
      doc.fontSize(20);
      doc.text('Laudo de Diagnóstico Molecular para os Vírus da Zika (ZIKV)', {align: 'center'});

      doc.moveDown();

      doc.fontSize(12);
      doc.text('NOME: ', {continued: true}).text($scope.laudo.nome);

      doc.fontSize(8);
      doc.text('DATA INÍCIO SINTOMAS: 15/02/1982', 72, 170);
      doc.text('DATA COLETA: 15/02/1982', 250, 170);
      doc.text('DATA RESULTADO: 15/02/1982', 400, 170);
      doc.moveDown();

      // Finish the document
      doc.end();
      stream.on('finish', () => {
        var link = document.createElement('a');
        link.href = stream.toBlobURL('application/pdf');
        link.target = '_blank';
        link.click();
      });
    });
  };

  $scope.limpar = function() {
    $scope.laudo = novoLaudo();
  };
}]);
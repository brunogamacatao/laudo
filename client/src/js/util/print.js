import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import fontkit from 'fontkit';

class PrintToPdf {
  constructor(laudo) {
    this.laudo = laudo;
  }

  /**
   * Método utilitário para formatar números, adicionando zeros a esquerda.
   * @param number O número que será formatado
   * @param size Quantos caracteres o número irá ocupar (default: 2)
   */
  pad(number, size) {
    var s = String(number);

    while (s.length < (size || 2)) {
      s = '0' + s;
    }

    return s;
  }

  /**
   * Método que converte um objeto Date para um string no formato 'dd/MM/yyyy'.
   * @param date Objeto date que será formatado
   */
  formatDate(date) {
    return this.pad(date.getDate()) + '/' +  // dia
           this.pad(date.getMonth()) + '/' + // mês
           date.getFullYear();          // ano
  }

  /**
   * Método utilitárip que converte um ArrayBuffer, retornado por um 
   * XMLHttpRequest, para um Buffer NodeJS. Essa conversão é necessária para as
   * fontes da biblioteca 'fontkit'.
   */ 
  toBuffer(ab) {
    var buf = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);

    for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }

    return buf;
  }

  stringToArrayBuffer(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);

    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }

    return buf;
  }  

  loadFonts(fonts, callback) {
    let toLoad = fonts.length;

    fonts.forEach((font) => {
      fetch(font).then(response => response.arrayBuffer()).then((font => {
        fontkit.openSync = (filename, postscriptName) => {
          return fontkit.create(this.toBuffer(font), postscriptName);
        };
      }).bind(this))
      .then(() => {
        if (--toLoad <= 0) {
          callback();
        }
      });
    });
  }

  layoutReport(doc) {
    doc.font('fonts/Roboto-Regular.ttf');

    // Add content
    doc.fontSize(20);
    doc.text('Laudo de Diagnóstico Molecular para os Vírus da Zika (ZIKV)', {align: 'center'});

    doc.moveDown();

    doc.fontSize(12);
    doc.text('NOME: ', {continued: true}).text(this.laudo.nome);

    doc.fontSize(8);
    doc.text('DATA INÍCIO SINTOMAS: 15/02/1982', 72, 170);
    doc.text('DATA COLETA: 15/02/1982', 250, 170);
    doc.text('DATA RESULTADO: 15/02/1982', 400, 170);
    doc.moveDown();

    // Finish the document
    doc.end();

    return doc;
  }

  print() {
    this.loadFonts(['fonts/Roboto-Regular.ttf'], () => {
      let doc = new PDFDocument();
      let stream = doc.pipe(blobStream());

      this.layoutReport(doc);

      stream.on('finish', () => {
        $('#myModal iframe').attr({
          src: stream.toBlobURL('application/pdf'),
          width: '100%',
          height: '100%'
        });
        $('#myModal').modal('show');
      });
    });
  }
};

export default PrintToPdf;
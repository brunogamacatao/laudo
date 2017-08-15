import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import fontkit from 'fontkit';
import 'buffer';

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
    if (!date) return 'Não consta';
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
    const RIGHT_MARGIN = 72;
    const font = 'fonts/Roboto-Regular.ttf';
    const TITLE_FONT_SIZE = 11;
    const FONT_SIZE = 9;
    const OFFSET = 0;
    const SIGNATURE_WIDTH = 100;

    doc.font(font);

    // Add content
    doc.fontSize(16);
    doc.text('Laudo de Diagnóstico Molecular para os Vírus da Zika (ZIKV)', {align: 'center'});

    doc.moveDown();

    var referente = " (" + (this.laudo.referente == 'filho' ? 'Criança' : 'Mãe') + ")";

    doc.fontSize(TITLE_FONT_SIZE);
    doc.text('NOME: ', {continued: true}).text(this.laudo.nome + referente);

    doc.fontSize(FONT_SIZE);
    //doc.text('DATA INÍCIO SINTOMAS: ' + this.formatDate(this.laudo.dataInicioSintomas), RIGHT_MARGIN, 130);
    doc.text('DATA COLETA: ' + this.formatDate(this.laudo.dataColeta), RIGHT_MARGIN, 130);
    doc.text('DATA RESULTADO: ' + this.formatDate(this.laudo.dataResultado), 260, 130);
    doc.moveDown();

    let caption = 'MATEIAL COLETADO:';
    let margin = OFFSET + RIGHT_MARGIN + doc.font(font).fontSize(TITLE_FONT_SIZE).widthOfString(caption);

    doc.fontSize(TITLE_FONT_SIZE);
    doc.text(caption, RIGHT_MARGIN, doc.y);
    doc.moveDown(0.5);

    doc.fontSize(FONT_SIZE);
    doc.text('(' + (this.laudo.materialColetado.sa  ? 'X' : ' ') + ') SANGUE- SG', margin);
    doc.text('(' + (this.laudo.materialColetado.ur  ? 'X' : ' ') + ') URINA-UR', margin);
    doc.text('(' + (this.laudo.materialColetado.la  ? 'X' : ' ') + ') LÍQUIDO AMNIÓTICO-LA', margin);
    doc.text('(' + (this.laudo.materialColetado.lcr ? 'X' : ' ') + ') LÍQUIDO CEFALORRAQUIDIANO-LCR', margin);
    doc.moveDown();

    caption = 'METODOLOGIA: ' + this.laudo.metodologia;
    margin = OFFSET + RIGHT_MARGIN + doc.font(font).fontSize(TITLE_FONT_SIZE).widthOfString(caption);

    doc.fontSize(TITLE_FONT_SIZE);
    doc.text(caption, RIGHT_MARGIN, doc.y);
    doc.moveDown();

    doc.fontSize(TITLE_FONT_SIZE);
    doc.text('CONCLUSÃO: ' + ((this.laudo.conclusao.zikv.positivo || this.laudo.conclusao.chikv.positivo) ? 'DETECTÁVEL' : 'INDETECTÁVEL'), RIGHT_MARGIN, doc.y);
    doc.moveDown(0.5);

    doc.fontSize(FONT_SIZE);
    doc.text('(' + (this.laudo.conclusao.zikv.positivo  ? 'X' : ' ') + ') ZIKV  Identificado em amostra de (' + (this.laudo.conclusao.zikv.sg  ? 'X' : ' ') + ')SG (' + (this.laudo.conclusao.zikv.ur  ? 'X' : ' ') + ')UR (' + (this.laudo.conclusao.zikv.la  ? 'X' : ' ') + ')LA (' + (this.laudo.conclusao.zikv.lcr  ? 'X' : ' ') + ')LCR', 120);
    doc.text('(' + (this.laudo.conclusao.chikv.positivo ? 'X' : ' ') + ') CHIKV Identificado em amostra de (' + (this.laudo.conclusao.chikv.sg ? 'X' : ' ') + ')SG (' + (this.laudo.conclusao.chikv.ur ? 'X' : ' ') + ')UR (' + (this.laudo.conclusao.chikv.la ? 'X' : ' ') + ')LA (' + (this.laudo.conclusao.chikv.lcr ? 'X' : ' ') + ')LCR', 120);

    if (!this.laudo.conclusao.sifilis) this.laudo.conclusao.sifilis = {};
    if (!this.laudo.conclusao.rubeola) this.laudo.conclusao.rubeola = {};
    if (!this.laudo.conclusao.toxoplasmose) this.laudo.conclusao.toxoplasmose = {};
    if (!this.laudo.conclusao.citomegalovirus) this.laudo.conclusao.citomegalovirus = {};
    if (!this.laudo.conclusao.herpes) this.laudo.conclusao.herpes = {};
    if (!this.laudo.conclusao.dengue) this.laudo.conclusao.dengue = {};

    doc.text('(' + (this.laudo.conclusao.sifilis.positivo ? 'X' : ' ') + ') Sífilis Identificado em amostra de (' + (this.laudo.conclusao.sifilis.sg ? 'X' : ' ') + ')SG (' + (this.laudo.conclusao.sifilis.ur ? 'X' : ' ') + ')UR (' + (this.laudo.conclusao.sifilis.la ? 'X' : ' ') + ')LA (' + (this.laudo.conclusao.sifilis.lcr ? 'X' : ' ') + ')LCR', 120);
    doc.text('(' + (this.laudo.conclusao.rubeola.positivo ? 'X' : ' ') + ') Rubéola Identificado em amostra de (' + (this.laudo.conclusao.rubeola.sg ? 'X' : ' ') + ')SG (' + (this.laudo.conclusao.rubeola.ur ? 'X' : ' ') + ')UR (' + (this.laudo.conclusao.rubeola.la ? 'X' : ' ') + ')LA (' + (this.laudo.conclusao.rubeola.lcr ? 'X' : ' ') + ')LCR', 120);
    doc.text('(' + (this.laudo.conclusao.toxoplasmose.positivo ? 'X' : ' ') + ') Toxoplasma Identificado em amostra de (' + (this.laudo.conclusao.toxoplasmose.sg ? 'X' : ' ') + ')SG (' + (this.laudo.conclusao.toxoplasmose.ur ? 'X' : ' ') + ')UR (' + (this.laudo.conclusao.toxoplasmose.la ? 'X' : ' ') + ')LA (' + (this.laudo.conclusao.toxoplasmose.lcr ? 'X' : ' ') + ')LCR', 120);
    doc.text('(' + (this.laudo.conclusao.citomegalovirus.positivo ? 'X' : ' ') + ') Citomegalovírus Identificado em amostra de (' + (this.laudo.conclusao.citomegalovirus.sg ? 'X' : ' ') + ')SG (' + (this.laudo.conclusao.citomegalovirus.ur ? 'X' : ' ') + ')UR (' + (this.laudo.conclusao.citomegalovirus.la ? 'X' : ' ') + ')LA (' + (this.laudo.conclusao.citomegalovirus.lcr ? 'X' : ' ') + ')LCR', 120);
    doc.text('(' + (this.laudo.conclusao.herpes.positivo ? 'X' : ' ') + ') Herpes 1/2 Identificado em amostra de (' + (this.laudo.conclusao.herpes.sg ? 'X' : ' ') + ')SG (' + (this.laudo.conclusao.herpes.ur ? 'X' : ' ') + ')UR (' + (this.laudo.conclusao.herpes.la ? 'X' : ' ') + ')LA (' + (this.laudo.conclusao.herpes.lcr ? 'X' : ' ') + ')LCR', 120);
    doc.text('(' + (this.laudo.conclusao.dengue.positivo ? 'X' : ' ') + ') Dengue Identificado em amostra de (' + (this.laudo.conclusao.dengue.sg ? 'X' : ' ') + ')SG (' + (this.laudo.conclusao.dengue.ur ? 'X' : ' ') + ')UR (' + (this.laudo.conclusao.dengue.la ? 'X' : ' ') + ')LA (' + (this.laudo.conclusao.dengue.lcr ? 'X' : ' ') + ')LCR', 120);
    

    doc.moveDown();

    if (this.laudo.notas) {
      doc.fontSize(TITLE_FONT_SIZE);
      doc.text('NOTAS:', RIGHT_MARGIN, doc.y);
      doc.moveDown(0.5);

      doc.fontSize(FONT_SIZE);
      doc.text(this.laudo.notas);
      doc.moveDown();
    }

    function finalizaDocumento() {
      doc.fontSize(TITLE_FONT_SIZE);
      doc.text('OBSERVAÇÕES: ', RIGHT_MARGIN, doc.y);
      doc.moveDown(0.5);

      doc.fontSize(FONT_SIZE);
      doc.text('(1) No caso de NÃO estar detectável na amostra, deve-se levar em consideração o tipo de material coletado e o tempo transcorrido entre o ínicio do sintomas observados e a data da coleta da amostra para realização do exame.');
      doc.text('(2) Amostra com detecção indeterminada para o ácido nucléico sugerimos a realização de nova coleta.');

      // Finish the document
      doc.end();
    }

    if (this.laudo.assinatura) {
      var xhr = new XMLHttpRequest;

      xhr.onload = function() {
        doc.fontSize(TITLE_FONT_SIZE);
        doc.text('ASSINATURA: ', RIGHT_MARGIN, doc.y);

        let sigX = (doc.page.width - SIGNATURE_WIDTH) / 2;
        doc.image(new Buffer(xhr.response), sigX, doc.y, {width: SIGNATURE_WIDTH});

        finalizaDocumento();
      };

      xhr.responseType = 'arraybuffer';
      xhr.open('GET', this.laudo.assinatura, true);
      xhr.send();
    } else {
      finalizaDocumento();
    }


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
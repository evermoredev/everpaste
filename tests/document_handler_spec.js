var DocumentHandler = require('../lib/doc_handler');
var Generator = require('../lib/key_generator');

describe('document_handler', () => {

  describe('randomKey', () => {

    it('should choose a key of the proper length', () => {
      var gen = new Generator();
      var dh = new DocumentHandler({ keyLength: 6, keyGenerator: gen });
      dh.acceptableKey().length.should.equal(6);
    });

    it('should choose a default key length', () => {
      var gen = new Generator();
      var dh = new DocumentHandler({ keyGenerator: gen });
      dh.keyLength.should.equal(DocumentHandler.defaultKeyLength);
    });

  });

});

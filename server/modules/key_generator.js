/**
 * Creates random keys to identify documents
 */
import config from '../config/config';

class RandomKeyGenerator {

  constructor() {
    this.keyChars = config.keyGenerator.keyChars;
    this.keyLength = config.keyGenerator.keyLength;
  }

  createKey() {
    let text = '';
    for (let i = 0; i < this.keyLength; i++) {
      text += this.keyChars[~~(Math.random() * this.keyChars.length)];
    }
    return text;
  }
}

export default RandomKeyGenerator;

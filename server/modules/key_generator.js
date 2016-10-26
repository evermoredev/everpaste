/**
 * Creates random keys to identify documents
 */
import Config from '../../config';

class RandomKeyGenerator {

  constructor() {
    this.keyChars = Config.keyChars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.keyLength = Config.keyLength || 10;
  }

  createKey() {
    let text = '';
    for (let i = 0; i < this.keyLength; i++) {
      text += this.keyChars[~~(Math.random() * this.keyChars.length)];
    }
    return text;
  }
}

export default new RandomKeyGenerator();

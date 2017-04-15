import serverConfig from '../config/config';

/**
 * Creates random keys to identify documents
 */
class RandomKeyGenerator {

  /**
   * Creates a randomKeyGenerator with keyChars and keyLength from
   * the server config.
   */
  constructor() {
    this.keyChars = serverConfig.keyGenerator.keyChars;
    this.keyLength = serverConfig.keyGenerator.keyLength;
  }

  /**
   * Creates a random key
   * @returns {string} String of random keys
   */
  createKey() {
    let text = '';
    for (let i = 0; i < this.keyLength; i++) {
      text += this.keyChars[~~(Math.random() * this.keyChars.length)];
    }
    return text;
  }

}

export default RandomKeyGenerator;

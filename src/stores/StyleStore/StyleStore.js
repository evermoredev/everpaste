import { observable, action } from 'mobx';
import cookie from 'cookie';

class StyleStore {

  constructor() {
    this.cookies = cookie.parse(document.cookie);
    this.defaultTheme = this.cookies.theme || 'atom-one-dark-theme';
  }

  @observable theme = this.defaultTheme;

  @action
  setTheme = (themeName) => {
    document.cookie = cookie.serialize('theme', String(themeName));
    this.theme = themeName;
  }
}

export default new StyleStore();

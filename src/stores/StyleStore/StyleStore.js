import { observable, action } from 'mobx';
import getCookie from 'core/modules/cookies';

class StyleStore {
  @observable theme = getCookie('theme') || 'atom-one-dark-theme';

  @action
  setTheme = (themeName) => {
    document.cookie = `theme=${themeName};`;
    document.cookie = 'key=1';
    this.theme = themeName;
  }
}

export default new StyleStore();

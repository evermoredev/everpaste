import { observable } from 'mobx';
import getCookie from 'core/modules/cookies';

class StyleStore {
  @observable theme = getCookie('theme') || 'default-theme';

  @action
  setTheme = (themeName) => {
    document.cookie = `theme=${themeName};`;
    t
  }
}

export default new StyleStore();

import { observable } from 'mobx';
import getCookie from 'core/modules/cookies';

class StyleStore {
  @observable theme = getCookie('theme') || 'default-theme';
}

export default StyleStore;

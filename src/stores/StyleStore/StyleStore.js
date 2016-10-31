import { observable, action } from 'mobx';
import cookie from 'cookie';

class StyleStore {

  constructor() {
    this.cookies = cookie.parse(document.cookie);
    this.defaultTheme = this.cookies.theme || 'atom-one-dark-theme';

    this.themes = [
      { name: 'Agate', className: 'agate-theme' },
      { name: 'Android Studio', className: 'androidstudio-theme' },
      { name: 'Arduino Light', className: 'arduino-light-theme' },
      { name: 'Arta', className: 'arta-theme' },
      { name: 'Ascetic', className: 'ascetic-theme' },
      { name: 'Atelier Cave Dark', className: 'atelier-cave-dark-theme' },
      { name: 'Atelier Cave Light', className: 'atelier-cave-light-theme' },
      { name: 'Atelier Dune Dark', className: 'atelier-dune-dark-theme' },
      { name: 'Atelier Dune Light', className: 'atelier-dune-light-theme' },
      { name: 'Atelier Estuary Dark', className: 'atelier-estuary-dark-theme' },
      { name: 'Atelier Estuary Light', className: 'atelier-estuary-light-theme' },
      { name: 'Atelier Forest Dark', className: 'atelier-forest-dark-theme' },
      { name: 'Atelier Forest Light', className: 'atelier-forest-light-theme' },
      { name: 'Atelier Heath Dark', className: 'atelier-heath-dark-theme' },
      { name: 'Atelier Heath Light', className: 'atelier-heath-light-theme' },
      { name: 'Atelier Lakeside Dark', className: 'atelier-lakeside-dark-theme' },
      { name: 'Atelier Lakeside Light', className: 'atelier-lakeside-light-theme' },
      { name: 'Atelier Plateau Dark', className: 'atelier-plateau-dark-theme' },
      { name: 'Atelier Plateau Light', className: 'atelier-plateau-light-theme' },
      { name: 'Atelier Savanna Dark', className: 'atelier-savanna-dark-theme' },
      { name: 'Atelier Savanna Light', className: 'atelier-savanna-light-theme' },
      { name: 'Atelier Seaside Dark', className: 'atelier-seaside-dark-theme' },
      { name: 'Atelier Seaside Light', className: 'atelier-seaside-light-theme' },
      { name: 'Atelier Sulphurpool Dark', className: 'atelier-sulphurpool-dark-theme' },
      { name: 'Atelier Sulphurpool Light', className: 'atelier-sulphurpool-light-theme' },
      { name: 'Atom One Dark', className: 'atom-one-dark-theme' },
      { name: 'Atom One Light', className: 'atom-one-light-theme' },
      { name: 'Brown Paper', className: 'brown-paper-theme' },
      { name: 'Codepen Embed', className: 'codepen-embed-theme' },
      { name: 'Color Brewer', className: 'color-brewer-theme' },
      { name: 'Darcula', className: 'darcula-theme' },
      { name: 'Dark', className: 'dark-theme' },
      { name: 'Docco', className: 'docco-theme' },
      { name: 'Dracula', className: 'dracula-theme' },
      { name: 'Far', className: 'far-theme' },
      { name: 'Foundation', className: 'foundation-theme' },
      { name: 'Github', className: 'github-theme' },
      { name: 'Github Gist', className: 'github-gist-theme' }
    ];
  }

  @observable theme = this.defaultTheme;

  @action
  setTheme = (themeName) => {
    document.cookie = cookie.serialize('theme', String(themeName));
    this.theme = themeName;
  }
}

export default new StyleStore();

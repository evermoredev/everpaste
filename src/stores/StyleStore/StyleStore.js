import { observable, action } from 'mobx';
import cookie from 'cookie';

class StyleStore {

  constructor() {

    // LIst of all available themes
    // TODO: Let's make this a hashmap with className property as the hash key
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
      { name: 'Github Gist', className: 'github-gist-theme' },
      { name: 'Google Code', className: 'googlecode-theme' },
      { name: 'Gray Scale', className: 'grayscale-theme' },
      { name: 'Gruvbox Dark', className: 'gruvbox-dark-theme' },
      { name: 'Gruvbox Light', className: 'gruvbox-light-theme' },
      { name: 'Hopscotch', className: 'hopscotch-theme' },
      { name: 'Hybrid', className: 'hybrid-theme' },
      { name: 'Idea', className: 'idea-theme' },
      { name: 'IR Black', className: 'ir-black-theme' },
      { name: 'Kimbie Dark', className: 'kimbie-dark-theme' },
      { name: 'Kimbie Light', className: 'kimbie-light-theme' },
      { name: 'Magula', className: 'magula-theme' },
      { name: 'Mono Blue', className: 'mono-blue-theme' },
      { name: 'Monokai', className: 'monokai-theme' },
      { name: 'Monokai Sublime', className: 'monokai-sublime-theme' },
      { name: 'Obsidian', className: 'obsidian-theme' },
      { name: 'Ocean', className: 'ocean-theme' },
      { name: 'Paraiso Dark', className: 'paraiso-dark-theme' },
      { name: 'Paraiso Light', className: 'paraiso-light-theme' },
      { name: 'Pojoaque', className: 'pojoaque-theme' },
      { name: 'Pure Basic', className: 'pure-basic-theme' },
      { name: 'QT Creator Dark', className: 'qtcreator-dark-theme' },
      { name: 'QT Creator Light', className: 'qtcreator-light-theme' },
      { name: 'Rails Casts', className: 'railscasts-theme' },
      { name: 'Rainbow', className: 'rainbow-theme' },
      { name: 'School Book', className: 'school-book-theme' },
      { name: 'Solarized Dark', className: 'solarized-dark-theme' },
      { name: 'Solarized Light', className: 'solarized-light-theme' },
      { name: 'Sunburst', className: 'sunburst-theme' },
      { name: 'Tomorrow', className: 'tomorrow-theme' },
      { name: 'Tomorrow Night', className: 'tomorrow-night-theme' },
      { name: 'Tomorrow Night Blue', className: 'tomorrow-night-blue-theme' },
      { name: 'Tomorrow Night Bright', className: 'tomorrow-night-bright-theme' },
      { name: 'Tomorrow Night Eighties', className: 'tomorrow-night-eighties-theme' },
      { name: 'VS', className: 'vs-theme' },
      { name: 'XCode', className: 'xcode-theme' },
      { name: 'XT256', className: 'xt256-theme' },
      { name: 'Zenburn', className: 'zenburn-theme' }
    ];

    this.cookies = cookie.parse(document.cookie);
    this.defaultTheme = this.cookies.theme || 'atom-one-dark-theme';
    this.defaultThemeDisplayName = this.getThemeDisplayName(this.defaultTheme);
  }

  @observable theme = this.defaultTheme;
  @observable themeDisplayName = this.defaultThemeDisplayName;

  @action
  setTheme = (themeName) => {
    document.cookie = cookie.serialize('theme', String(themeName));
    this.theme = themeName;
    this.themeDisplayName = this.getThemeDisplayName(this.theme);
  };

  getThemeDisplayName = (theme) =>
    this.themes.filter(t => t.className == theme)[0].name;

}

export default new StyleStore();

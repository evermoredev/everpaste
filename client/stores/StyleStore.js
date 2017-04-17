import { getCookie, setCookies } from '../modules/cookies';

/**
 * Store to manage all of the themes
 */
class StyleStore {

  constructor() {
    
    // LIst of all available themes
    this.themes = {
      'Agate': 'agate-theme',
      'Android Studio': 'androidstudio-theme',
      'Arduino Light': 'arduino-light-theme',
      'Arta': 'arta-theme',
      'Ascetic': 'ascetic-theme',
      'Atelier Cave Dark': 'atelier-cave-dark-theme',
      'Atelier Cave Light': 'atelier-cave-light-theme',
      'Atelier Dune Dark': 'atelier-dune-dark-theme',
      'Atelier Dune Light': 'atelier-dune-light-theme',
      'Atelier Estuary Dark': 'atelier-estuary-dark-theme',
      'Atelier Estuary Light': 'atelier-estuary-light-theme',
      'Atelier Forest Dark': 'atelier-forest-dark-theme',
      'Atelier Forest Light': 'atelier-forest-light-theme',
      'Atelier Heath Dark': 'atelier-heath-dark-theme',
      'Atelier Heath Light': 'atelier-heath-light-theme',
      'Atelier Lakeside Dark': 'atelier-lakeside-dark-theme',
      'Atelier Lakeside Light': 'atelier-lakeside-light-theme',
      'Atelier Plateau Dark': 'atelier-plateau-dark-theme',
      'Atelier Plateau Light': 'atelier-plateau-light-theme',
      'Atelier Savanna Dark': 'atelier-savanna-dark-theme',
      'Atelier Savanna Light': 'atelier-savanna-light-theme',
      'Atelier Seaside Dark': 'atelier-seaside-dark-theme',
      'Atelier Seaside Light': 'atelier-seaside-light-theme',
      'Atelier Sulphurpool Dark': 'atelier-sulphurpool-dark-theme',
      'Atelier Sulphurpool Light': 'atelier-sulphurpool-light-theme',
      'Atom One Dark': 'atom-one-dark-theme',
      'Atom One Light': 'atom-one-light-theme',
      'Brown Paper': 'brown-paper-theme',
      'Codepen Embed': 'codepen-embed-theme',
      'Color Brewer': 'color-brewer-theme',
      'Darcula': 'darcula-theme',
      'Dark': 'dark-theme',
      'Docco': 'docco-theme',
      'Dracula': 'dracula-theme',
      'Far': 'far-theme',
      'Foundation': 'foundation-theme',
      'Github': 'github-theme',
      'Github Gist': 'github-gist-theme',
      'Google Code': 'googlecode-theme',
      'Gray Scale': 'grayscale-theme',
      'Gruvbox Dark': 'gruvbox-dark-theme',
      'Gruvbox Light': 'gruvbox-light-theme',
      'Hopscotch': 'hopscotch-theme',
      'Hybrid': 'hybrid-theme',
      'Idea': 'idea-theme',
      'IR Black': 'ir-black-theme',
      'Kimbie Dark': 'kimbie-dark-theme',
      'Kimbie Light': 'kimbie-light-theme',
      'Magula': 'magula-theme',
      'Mono Blue': 'mono-blue-theme',
      'Monokai': 'monokai-theme',
      'Monokai Sublime': 'monokai-sublime-theme',
      'Obsidian': 'obsidian-theme',
      'Ocean': 'ocean-theme',
      'Paraiso Dark': 'paraiso-dark-theme',
      'Paraiso Light': 'paraiso-light-theme',
      'Pojoaque': 'pojoaque-theme',
      'Pure Basic': 'pure-basic-theme',
      'QT Creator Dark': 'qtcreator-dark-theme',
      'QT Creator Light': 'qtcreator-light-theme',
      'Rails Casts': 'railscasts-theme',
      'Rainbow': 'rainbow-theme',
      'School Book': 'school-book-theme',
      'Solarized Dark': 'solarized-dark-theme',
      'Solarized Light': 'solarized-light-theme',
      'Sunburst': 'sunburst-theme',
      'Tomorrow': 'tomorrow-theme',
      'Tomorrow Night': 'tomorrow-night-theme',
      'Tomorrow Night Blue': 'tomorrow-night-blue-theme',
      'Tomorrow Night Bright': 'tomorrow-night-bright-theme',
      'Tomorrow Night Eighties': 'tomorrow-night-eighties-theme',
      'VS': 'vs-theme',
      'XCode': 'xcode-theme',
      'XT256': 'xt256-theme',
      'Zenburn': 'zenburn-theme'
    };

    this.theme = {};
    this.setTheme(getCookie('theme'));
  }

  /**
   * Sets the selected theme on the instance of StyleStore and updates the
   * theme cookie
   * @param {string} themeName
   */
  setTheme = (themeName) => {
    if (this.themes[themeName]) {
      this.theme = {
        name: themeName,
        className: this.themes[themeName]
      }
    } else {
      this.theme = {
        name: 'Atom One Dark',
        className: this.themes['Atom One Dark']
      }
    }
    setCookies({ name: 'theme', value: this.theme.name });
  };

}

export default StyleStore;

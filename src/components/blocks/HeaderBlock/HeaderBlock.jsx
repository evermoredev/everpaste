import React from 'react';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import { Link } from 'react-router';

import HeaderBlockStore from './HeaderBlockStore';

@observer(['AppStore','ViewsStore'])
class HeaderBlock extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.store = new HeaderBlockStore(this.props);
  }

  componentWillReact() {
    console.log(this.props);
  }

  renderLink = (options) => {
    return (
      <Link to={{ pathname: options.to, state: options.state || {} }}>
        <i className={options.iconClass} />
        <span className="navigation-tooltip">
          {options.tooltip}
        </span>
      </Link>
    );
  };

  render() {
    return (
      <div className="main-nav unselectable">
        <Link to="/">
          <div className="left-nav">
            <img src="/img/logo.svg" alt="logo" className="logo" />
            <h1>{document.title}</h1>
          </div>
        </Link>

        <div className="right-nav">

          <div className="mobile-navicon">
            <a href="#" onClick={this.store.handleMobileNaviconClick}>
              <i className="fa fa-bars" />
            </a>
          </div>

          <ul className={this.store.mobileNavigationClass}>
            <li>
              {this.renderLink({to: '/', iconClass: 'fa fa-plus', tooltip: 'New'})}
            </li>
            <li onClick={this.store.saveButton}>
              <a>
                <i className="fa fa-floppy-o" />
                <span className="navigation-tooltip">
                    Save
                </span>
              </a>
            </li>
            <li>
              {this.renderLink({to: `/edit`, iconClass: 'fa fa-pencil', tooltip: 'Edit', state: { editLink: true }})}
            </li>
            <li onClick={this.store.rawButton}>
              <a>
                <i className="fa fa-files-o" />
                <span className="navigation-tooltip">
                  Raw
                </span>
              </a>
            </li>
            <li>
              {this.renderLink({to: '/public', iconClass: 'fa fa-globe', tooltip: 'Public'})}
            </li>
            <li>
              {this.renderLink({to: '/settings', iconClass: 'fa fa-gear', tooltip: 'Settings'})}
            </li>
            <li>
              {this.renderLink({to: '/help', iconClass: 'fa fa-question', tooltip: 'Help'})}
            </li>
            <li className="mobile-overlay" />
          </ul>

          <ul className='desktop-navicon'>
            <li>
              {this.renderLink({to: '/', iconClass: 'fa fa-plus', tooltip: 'New'})}
            </li>
            <li onClick={this.store.saveButton}>
              <a>
                <i className="fa fa-floppy-o" />
                <span className="navigation-tooltip">
                    Save
                </span>
              </a>
            </li>
            <li>
              {this.renderLink({to: `/edit`, iconClass: 'fa fa-pencil', tooltip: 'Edit', state: { editLink: true }})}
            </li>
            <li onClick={this.store.rawButton}>
              <a>
                <i className="fa fa-files-o" />
                <span className="navigation-tooltip">
                  Raw
                </span>
              </a>
            </li>
            <li>
              {this.renderLink({to: '/public', iconClass: 'fa fa-globe', tooltip: 'Public'})}
            </li>
            <li>
              {this.renderLink({to: '/settings', iconClass: 'fa fa-gear', tooltip: 'Settings'})}
            </li>
            <li>
              {this.renderLink({to: '/help', iconClass: 'fa fa-question', tooltip: 'Help'})}
            </li>
          </ul>
        </div>
      </div>
    )
  }

}

export default HeaderBlock;

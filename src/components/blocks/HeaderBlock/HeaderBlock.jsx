import React from 'react';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import { Link } from 'react-router';

import HeaderBlockStore from './HeaderBlockStore';

@observer(['GlobalStore','ViewsStore'])
class HeaderBlock extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.store = new HeaderBlockStore(this.props);
  }

  renderLink = (options) => {
    return (
      <Link to={options.to}>
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
            <li><Link to="/"><i className="fa fa-plus" />New</Link></li>
            <li>
              <a href="#"><i className="fa fa-floppy-o" />Save</a>
            </li>
            <li>
              <Link to={{ pathname: '/', state: { editLink: true }}}
                    isActive={() => this.props.GlobalStore.currentView == 'EditView'}
              >
                <i className="fa fa-pencil" />Edit</Link>
            </li>
            <li>
              <a onClick={this.handleRawLink}
                 href={`/raw/${this.props.GlobalStore.docKey || ''}`}
                 target={'_blank'}
              >
                <i className="fa fa-files-o" />Raw
              </a>
            </li>
            <li>
              <Link to="/settings">
                <i className="fa fa-gear" />Settings
              </Link>
            </li>
            <li className="mobile-overlay" />
          </ul>
          <ul className='desktop-navicon'>
            <li>
              {this.renderLink({to: '/', iconClass: 'fa fa-plus', tooltip: 'New'})}
            </li>
            <li onClick={this.store.saveButton}>
              {this.renderLink({to: '/', iconClass: 'fa fa-floppy-o', tooltip: 'Save'})}
            </li>
            <li>
              <Link to={{ pathname: '/', state: { editLink: true }}}
                    isActive={() => this.props.GlobalStore.currentView == 'EditView'}
              >
                <i className="fa fa-pencil" />
                <span className="navigation-tooltip">
                  Edit
                </span>
              </Link>
            </li>
            <li>
              <a onClick={this.handleRawLink}
                 href={`/raw/${this.props.GlobalStore.docKey || ''}`}
                 target={'_blank'}
              >
                <i className="fa fa-files-o" />
                <span className="navigation-tooltip">
                  Raw
                </span>
              </a>
            </li>
            <li>
              {this.renderLink({to: '/Settings', iconClass: 'fa fa-gear', tooltip: 'Settings'})}
            </li>
          </ul>
        </div>
      </div>
    )
  }

}

export default HeaderBlock;

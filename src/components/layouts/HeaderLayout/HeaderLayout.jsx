import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router';

import HeaderLayoutState from './HeaderLayout.state';

@observer
class HeaderLayout extends React.Component {

  constructor(props) {
    super(props);
  }

  saveButton = () => this.props.saveButton ? this.props.saveButton() : false;
  editButton = () => this.props.editButton ? this.props.editButton() : false;

  render() {
    return (
      <div className="main-nav unselectable">
        <div className="left-nav">
          <img src="/img/logo.svg" alt="logo" className="logo" />
          <h1>{document.title}</h1>
        </div>
        <div className="right-nav">
          <div className="mobile-navicon">
            <a href="#" onClick={HeaderLayoutState.handleMobileNaviconClick}>
              <i className="fa fa-bars" />
            </a>
          </div>
          <ul className={HeaderLayoutState.mobileNavigationClass}>
            <li><Link to="/"><i className="fa fa-plus" />New</Link></li>
            <li>
              <a href="#"><i className="fa fa-floppy-o" />Save</a>
            </li>
            <li>
              <Link to="/">
              <i className="fa fa-pencil" />Edit</Link>
            </li>
            <li>
              <a
                href={this.props.docKey ? `/raw/${this.props.docKey}` : ''}
                target={this.props.docKey ? '_blank' : ''}
              >
                <i className="fa fa-files-o" />Raw
              </a>
            </li>
            <li className="mobile-overlay" />
          </ul>
          <ul className='desktop-navicon'>
            <li>
              <Link to="/">
                <i className="fa fa-plus" />
                <span className="navigation-tooltip">
                  New
                </span>
              </Link>
            </li>
            <li>
              <a href="#" onClick={this.saveButton}>
                <i className="fa fa-floppy-o" />
                <span className="navigation-tooltip">
                  Save
                </span>
              </a>
            </li>
            <li>
              <Link to="/">
                <i className="fa fa-pencil" />
                 <span className="navigation-tooltip">
                  Edit
                </span>
              </Link>
            </li>
            <li>
              <a
                href={this.props.docKey ? `/raw/${this.props.docKey}` : ''}
                target={this.props.docKey ? '_blank' : ''}
              >
                <i className="fa fa-files-o" />
                <span className="navigation-tooltip">
                  Raw
                </span>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa fa-gear" />
                <span className="navigation-tooltip">
                  Settings
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }

}

export default HeaderLayout;

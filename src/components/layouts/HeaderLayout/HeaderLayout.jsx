import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router';

@observer(['GlobalStore','HeaderLayoutStore'])
class HeaderLayout extends React.Component {

  constructor(props) {
    super(props);
  }

  saveButton = () => this.props.saveButton ? this.props.saveButton() : false;
  editButton = () => this.props.editButton ? this.props.editButton() : false;

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
            <a href="#" onClick={this.props.HeaderLayoutStore.handleMobileNaviconClick}>
              <i className="fa fa-bars" />
            </a>
          </div>
          <ul className={this.props.HeaderLayoutStore.mobileNavigationClass}>
            <li><Link to="/"><i className="fa fa-plus" />New</Link></li>
            <li>
              <a href="#"><i className="fa fa-floppy-o" />Save</a>
            </li>
            <li>
              <Link to="/"
                    isActive={(location) => location.pathname.match(/.{10,}/)}
              >
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
            <li>
              <Link to="/settings">
                <i className="fa fa-gear" />Settings
              </Link>
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
              <Link to="/"
                    isActive={(location) => location.pathname.match(/.{10,}/)}
              >
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
              <Link to="/settings">
                <i className="fa fa-gear" />
                <span className="navigation-tooltip">
                  Settings
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }

}

export default HeaderLayout;

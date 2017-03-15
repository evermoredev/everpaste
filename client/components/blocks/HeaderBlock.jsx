import React from 'react';
import { Link } from 'react-router-dom';

class HeaderBlock extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isMobileNavigationToggled: true,
      mobileNavigationClass: 'mobile-navigation'
    }
  }

  /**
   * Determines if a particular header link is disabled.
   * @param link
   */
  isDisabled = (name) =>
    this.props.disabled && this.props.disabled[name.toLowerCase()];

  /**
   * Sets the mobile navigation display
   * @param event
   */
  handleMobileNaviconClick = (event) => {
    event.preventDefault();
    if (this.state.isMobileNavigationToggled) {
      this.setState({
        isMobileNavigationToggled: false,
        mobileNavigationClass: 'mobile-navigation active'
      });
    } else {
      this.setState({
        isMobileNavigationToggled: true,
        mobileNavigationClass: 'mobile-navigation'
      });
    }
  };

  renderLink = (options) => {
    const isDisabled = this.isDisabled(options.name);
    return (isDisabled) ? (
      <li className='disabled'>
        <a>
          <i className={options.iconClass} />
        </a>
      </li>
    ) : (
      <li>
        <Link to={{ pathname: options.to, state: options.state || {} }}>
          <i className={options.iconClass} />
          <span className="navigation-tooltip">{options.name}</span>
        </Link>
      </li>
    );
  };

  renderActionLink = (options) => {
    const isDisabled = this.isDisabled(options.name);
    return (isDisabled || !options.action) ? (
      <li className='disabled'>
        <a>
          <i className={options.iconClass} />
        </a>
      </li>
    ) : (
      <li onClick={options.action}>
        <a>
          <i className={options.iconClass} />
          <span className="navigation-tooltip">
          {options.name}
        </span>
        </a>
      </li>
    );
  };

  render() {
    return (
      <div className="header-block unselectable">
        <Link to="/">
          <div className="left-nav">
            <img src="/img/logo.svg" alt="logo" className="logo" />
            <h1>{document.title}</h1>
          </div>
        </Link>

        <div className="right-nav">

          <div className="mobile-navicon">
            <a href="#" onClick={this.state.handleMobileNaviconClick}>
              <i className="fa fa-bars" />
            </a>
          </div>

          { /** Mobile Navigation **/ }
          <ul className={this.state.mobileNavigationClass}>
            {this.renderLink({to: '/', iconClass: 'fa fa-plus', name: 'New'})}
            {this.renderActionLink({ action: this.props.saveButton, name: 'Save', iconClass: 'fa fa-floppy-o' })}
            {this.renderLink({to: `/edit`, iconClass: 'fa fa-pencil', name: 'Edit', state: { editLink: true, currentPaste: this.props.currentPaste }})}
            {this.renderActionLink({ action: this.props.rawButton, name: 'Raw', iconClass: 'fa fa-files-o' })}
            {this.renderLink({to: '/public', iconClass: 'fa fa-globe', name: 'Public'})}
            {this.renderLink({to: '/settings', iconClass: 'fa fa-gear', name: 'Settings'})}
            {this.renderLink({to: '/help', iconClass: 'fa fa-question', name: 'Help'})}
            <li className="mobile-overlay" />
          </ul>

          { /** Desktop Navigation **/ }
          <ul className='desktop-navicon'>
            {this.renderLink({to: '/', iconClass: 'fa fa-plus', name: 'New', state: { clicked: true }})}
            {this.renderActionLink({ action: this.props.saveButton, name: 'Save', iconClass: 'fa fa-floppy-o' })}
            {this.renderLink({to: `/edit`, iconClass: 'fa fa-pencil', name: 'Edit', state: { editLink: true, currentPaste: this.props.currentPaste }})}
            {this.renderActionLink({ action: this.props.rawButton, name: 'Raw', iconClass: 'fa fa-files-o' })}
            {this.renderLink({to: '/public', iconClass: 'fa fa-globe', name: 'Public'})}
            {this.renderLink({to: '/settings', iconClass: 'fa fa-gear', name: 'Settings'})}
            {this.renderLink({to: '/help', iconClass: 'fa fa-question', name: 'Help'})}
          </ul>
        </div>
      </div>
    )
  }

}

export default HeaderBlock;

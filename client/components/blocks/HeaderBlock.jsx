import React from 'react';
import { Link } from 'react-router-dom';

import clientConfig from '../../config/config';
import { Condition } from '../../modules/components'

/**
 * Header display containing navigation links
 */
class HeaderBlock extends React.Component {

  constructor(props) {
    super(props);
    // Set mobile nav menu to closed initially
    this.state = {
      isMobileNavOpen: false
    };
  }

  /**
   * Determines if a particular header link is disabled.
   * @param name
   */
  isDisabled = (name) =>
    this.props.disabled && this.props.disabled[name.toLowerCase()];

  /**
   * Sets the mobile navigation display
   * @param event
   */
  toggleMobileNav = (event) => {
    console.log('in toggle');
    this.setState({ isMobileNavOpen: !this.state.isMobileNavOpen });
  };

  /**
   * Helper to render a icon/link combination
   * @param {object} options
   */
  renderLink = (options) => {
    const isDisabled = this.isDisabled(options.name);
    return (isDisabled) ? (
      <li className='disabled'>
        <a>
          <i className={options.iconClass} />
          <Condition condition={this.state.isMobileNavOpen}>
            <span className="navigation-tooltip disabled">{options.name}</span>
          </Condition>
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

  /**
   * Helper to render a icon/link combination. Different from renderLink
   * in that these items have an onClick action when enabled.
   * @param {object} options
   */
  renderActionLink = (options) => {
    const isDisabled = this.isDisabled(options.name);
    return (isDisabled || !options.action) ? (
      <li className='disabled'>
        <a>
          <i className={options.iconClass} />
          <Condition condition={this.state.isMobileNavOpen}>
            <span className="navigation-tooltip disabled">{options.name}</span>
          </Condition>
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
            <img src={clientConfig.logoUrl} alt="logo" className="logo" />
            <h1>{clientConfig.headerTitle}</h1>
          </div>
        </Link>

        <div className="right-nav">

          <div className="mobile-navicon">
            <a href="#" onClick={this.toggleMobileNav}>
              <i className="fa fa-bars" />
            </a>
          </div>

          { /** Mobile Navigation **/ }
          <Condition condition={this.state.isMobileNavOpen}>
            <ul
              className='mobile-navigation active'
            >
              {this.renderLink({to: '/', iconClass: 'fa fa-plus', name: 'New'})}
              {this.renderActionLink({ action: this.props.saveButton, name: 'Save', iconClass: 'fa fa-floppy-o' })}
              {this.renderLink({to: `/edit`, iconClass: 'fa fa-pencil', name: 'Edit', state: { editLink: true, currentPaste: this.props.currentPaste }})}
              {this.renderActionLink({ action: this.props.rawButton, name: 'Raw', iconClass: 'fa fa-files-o' })}
              {this.renderLink({to: '/public', iconClass: 'fa fa-globe', name: 'Public'})}
              {this.renderLink({to: '/settings', iconClass: 'fa fa-gear', name: 'Settings'})}
              {this.renderLink({to: '/help', iconClass: 'fa fa-question', name: 'Help'})}
              <li className="mobile-overlay" onClick={this.toggleMobileNav} />
            </ul>
          </Condition>

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

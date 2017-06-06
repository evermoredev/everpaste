import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Link } from 'react-router-dom';

import { HeaderBlock } from '../blocks';
import { Condition } from '../../modules/components';

/**
 * This is an intermediate view between posting a paste from PasteView and
 * being redirected to ReadView. Currently this is only used for displaying
 * a generated secret key after posting with the AES privacy option.
 */
class SavedView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      copied: ''
    };
  }

  /**
   * Used to copy the secret key to the clipboard from clicking on an icon
   * @param {object} event
   */
  copyToClipboard = (event) => {
    this.textArea.select();
    try {
      document.execCommand('copy');
      this.setState({ copied: 'Copied!' });
      event.target.focus();
    } catch (err) {
      // Document not copied
    }
  };

  render() {
    let docKey, secretKey;

    // Make sure we got here from the router, with proper information otherwise
    // send them home.
    try {
      docKey = this.props.location.state.docKey;
      secretKey = this.props.location.state.secretKey;
    } catch(error) {
      return <Redirect to="/" push={false} />;
    }

    return (
      <div className={
        `view ${this.context.styleStore.theme.className}`}
      >
        <HeaderBlock
          disabled={{
            raw: true,
            edit: true,
            save: true
          }}
        />
        <div className="view-container flex-col white-text red-links">
          <div className="text-center">
            Document Key: <Link to={`/${docKey}`}>{docKey}</Link>
          </div>
          <div className="text-center m-10">
            Secret Key
            <Condition condition={document.queryCommandSupported('copy')}>
              <span onClick={this.copyToClipboard}>
                &nbsp;<i className="fa fa-clipboard" />&nbsp;
                {this.state.copied}
              </span>
            </Condition>
          </div>
          <textarea
            ref={(textarea) => this.textArea = textarea}
            readOnly value={secretKey}
          />
        </div>
      </div>
    );
  }

}

SavedView.contextTypes = {
  styleStore: PropTypes.object
};

export default SavedView;

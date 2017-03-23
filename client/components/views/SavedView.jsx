import React from 'react';
import { HeaderBlock } from '../blocks';
import { Redirect, Link } from 'react-router-dom';
import { Condition } from '../../modules/components';

class SavedView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      copied: ''
    }
  }

  copyToClipboard = (e) => {
    this.textArea.select();
    try {
      document.execCommand('copy');
      e.target.focus();
      this.setState({ copied: 'Copied!'});
    } catch (err) {
      // Document not copied
    }
  };

  render() {
    let docKey, secretKey;

    try {
      docKey = this.props.location.state.docKey;
      secretKey = this.props.location.state.secretKey;
    } catch(e) {
      return <Redirect to="/" />
    }

    return (
      <div className={`saved-view flex-container ${this.context.styleStore.theme}`}>
        <HeaderBlock
          disabled={{
            raw: true,
            edit: true,
            save: true
          }}
        />
        <div className="view-container">
          <div className="text-center">
            Document Key: <Link to={`/${docKey}`}>{docKey}</Link>
          </div>
          <div className="text-center" style={{ marginTop: '10px' }}>
            Secret Key
            {console.log(document.execCommand('copy'))}
            <Condition condition={document.queryCommandSupported('copy')}>
              &nbsp;
              <span onClick={this.copyToClipboard} style={{ color: 'white'}}>
                <i className="fa fa-clipboard" />
              </span>
              &nbsp;
            </Condition>
          </div>
          <form className="pure-form">
            <div className="text-container">
              <textarea
                ref={(textarea) => this.textArea = textarea}
                readOnly value={secretKey}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }

}

SavedView.contextTypes = {
  styleStore: React.PropTypes.object
};

export default SavedView;

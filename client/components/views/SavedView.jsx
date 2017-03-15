import React from 'react';
import { HeaderBlock } from '../blocks';
import { Redirect } from 'react-router-dom';

class SavedView extends React.Component {

  constructor(props) {
    super(props);
  }

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
          <div>
            Paste: <a href={`/${docKey}`}>{docKey}</a>
          </div>
          <div>Secret Key:</div>
          <div>${secretKey}</div>
        </div>
      </div>
    );
  }

}

SavedView.contextTypes = {
  styleStore: React.PropTypes.object
};

export default SavedView;

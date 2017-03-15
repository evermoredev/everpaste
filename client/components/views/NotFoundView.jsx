import React from 'react';
import { HeaderBlock } from '../blocks';

class NotFoundView extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`not-found-view flex-container ${this.context.styleStore.theme}`}>
        <HeaderBlock
          disabled={{ raw: true, edit: true, save: true }}
        />
        <div className="view-container" style={{ margin: '0 auto' }}>
          <pre style={{ color: 'white' }}>
            <br /><br />
            &nbsp;&nbsp;&nbsp;The paste you're looking for<br />
            &nbsp;&nbsp;&nbsp;&nbsp;isn't hanging around here.<br /><br /><br />
              `""==,,__<br />
              &nbsp;&nbsp;`"==..__"=..__ _    _..-==""_<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.-,`"=/ /\ \""/_)==""``<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( (    | | | \/ |<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\ '.  |  \;  \ /<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  \ |   |   ||<br />
              &nbsp;&nbsp;&nbsp;,-._.'  |_|   |   ||<br />
              &nbsp;&nbsp;o\_/\     -'   ;   Y<br />
              &nbsp;|`_o| |        /    |-.<br />
              &nbsp;'. `_/_    _.-'     /'<br />
              &nbsp;&nbsp;&nbsp;``   `'-.._____.-'<br />
          </pre>
        </div>
      </div>
    );
  }

}

NotFoundView.contextTypes = {
  styleStore: React.PropTypes.object
};

export default NotFoundView;

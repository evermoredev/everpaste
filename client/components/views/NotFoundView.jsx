import PropTypes from 'prop-types';
import React from 'react';
import { HeaderBlock } from '../blocks';

/**
 * The 404 view for the application
 */
class NotFoundView extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={
        `view ${this.context.styleStore.theme.className}`}
      >
        <HeaderBlock
          disabled={{ raw: true, edit: true, save: true }}
        />
        <div className="view-container white-text margin-auto">
          <pre>
            <br /><br />
            &nbsp;&nbsp;&nbsp;The paste you're looking for<br />
            &nbsp;&nbsp;&nbsp;&nbsp;isn't hanging around here.<br /><br /><br />
              `""==,,__<br />
              &nbsp;&nbsp;`"==..__"=..__ _    _..-==""_<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.-,`"=/ /\ \""/_)==""``
              <br />
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
  styleStore: PropTypes.object
};

NotFoundView.displayName = 'NotFoundView';

export default NotFoundView;

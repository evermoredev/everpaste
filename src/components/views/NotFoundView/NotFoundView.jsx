import React from 'react';
import { observer } from 'mobx-react';

@observer(['AppStore'])
class NotFoundView extends React.Component {

  constructor(props) {
    super(props);

    this.props.AppStore.currentView = 'NotFoundView';
  }

  render() {
    return (
      <div className="not-found">
        <div>

        </div>
      </div>
    );
  }

}

export default NotFoundView;

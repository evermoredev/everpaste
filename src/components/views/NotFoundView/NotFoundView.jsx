import React from 'react';
import { observer } from 'mobx-react';

import { HeaderLayout } from 'components/layouts';

@observer(['GlobalStore'])
class NotFoundView extends React.Component {

  constructor(props) {
    super(props);

    this.props.GlobalStore.currentView = 'NotFoundView';
  }

  render() {
    return (
      <div className="not-found">
        <HeaderLayout />
        <div>
          {`So incredibly sorry! It seems the page you are looking for
        could not be found!`}
        </div>
      </div>
    );
  }

}

export default NotFoundView;

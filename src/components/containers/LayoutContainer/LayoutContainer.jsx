import React from 'react';
import { observer } from 'mobx-react';

import HeaderLayout from 'components/layouts/HeaderLayout';

@observer(['StyleStore'])
class LayoutContainer extends React.Component {

  static displayName = 'LayoutContainer';

  constructor(props) {
    super(props);
  }

  render() {
    const { error, children, StyleStore } = this.props;

    if (error) {
      return children;
    } else {
      return (
        <div className={StyleStore.theme}>
          <div className="main-container hljs">
            <HeaderLayout {...this.props} />
            <div className="view-container">
              {children}
            </div>
          </div>
        </div>
      );
    }
  }

}

export default LayoutContainer;

import React from 'react';

import HeaderLayout from 'components/layouts/HeaderLayout';

class LayoutContainer extends React.Component {

  static displayName = 'LayoutContainer';

  constructor(props) {
    super(props);
  }

  render() {
    const { error, children } = this.props;

    if (error) {
      return children;
    } else {
      return (
        <div>
          <div className="main-container">
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

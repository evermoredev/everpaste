import React from 'react';
import { observer } from 'mobx-react';
import HeaderBlock from 'components/blocks/HeaderBlock/HeaderBlock';

@observer(['StyleStore'])
class StandardLayout extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { children, StyleStore } = this.props;

    return (
      <div className={`main-container ${StyleStore.theme}`}>
        <HeaderBlock />
        <div className="view-container">
          {children}
        </div>
      </div>
    );
  }

}

export default StandardLayout;

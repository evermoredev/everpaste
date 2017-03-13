import React from 'react';

/**
 * Only displays its children if the condition passed is true
 */
class Condition extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (this.props.condition) ? <div {...this.props}>{this.props.children}</div> : null;
  }

}

export default Condition;

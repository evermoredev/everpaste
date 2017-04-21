import React from 'react';

/**
 * Renders the curly brace loading screen
 */
class LoaderBlock extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="loader hljs">
        <span>&#123;</span>
        <span>&#125;</span>
      </div>
    );
  }

}

export default LoaderBlock;

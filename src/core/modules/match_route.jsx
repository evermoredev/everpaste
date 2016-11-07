/**
 * MatchRoute is a component that wraps react router 4's match
 * component to provide additional functionality like passing in layouts
 * and injecting stores with provifers
 */
import React from 'react';
import { Match } from 'react-router';

class MatchRoute extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Match
        pattern={this.props.pattern}
        exactly={!!this.props.exactly}
        render={(matchProps) => (
          <this.props.layout>
            <this.props.component {...matchProps} />
          </this.props.layout>
        )}
      />
    );
  }

}

export default MatchRoute;

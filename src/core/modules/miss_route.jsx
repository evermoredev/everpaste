/**
 * MatchRoute is a component that wraps react router 4's match
 * component to provide additional functionality like passing in layouts
 * and injecting stores with provifers
 */
import React from 'react';
import { Miss } from 'react-router';

class MissRoute extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Miss render={() => (
          <this.props.layout>
            <this.props.component {...(this.props.matchProps || {})} />
          </this.props.layout>
        )}
      />
    );
  }

}

export default MissRoute;

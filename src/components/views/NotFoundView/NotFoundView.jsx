import React from 'react';

class NotFoundView extends React.Component {

  static displayName = 'NotFound';

  constructor(props) {
    super(props);
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

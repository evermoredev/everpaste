import React from 'react';
import axios from 'axios';
import HeaderLayout from 'components/layouts/HeaderLayout';

class PublicListView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      loading: true
    }
  }

  // Once the component mounts, make the api request for the list of docs
  componentDidMount() {
    this.getPublicDocs();
  }

  getPublicDocs = () => {
    axios
      .get('/api/list')
      .then(res => {
        const newState =
          Object.assign({}, this.state, { docs: res.data, loading: false });
        this.setState(newState);
      })
      .catch(error => {
        console.log(error);
      });
  };

  renderDocsList = () => this.state.docs.map((d, idx) => (
    <div className="doc-list-item" key={idx}>
      {d.text}
    </div>
  ));

  render() {
    return (
      <div className="public-list-view">
        <HeaderLayout />
        {this.renderDocsList()}
      </div>
    );
  }
}

export default PublicListView;

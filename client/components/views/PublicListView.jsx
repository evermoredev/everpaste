import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { HeaderBlock } from '../blocks';
import { Condition } from '../../modules/components';

class PublicListView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      docList: [],
      loading: true
    }
  }

  // Once the component mounts, make the api request for the list of docs
  componentWillMount() {
    this.getDocList();
  }

  getDocList = () => {
    axios
      .get('/api/list')
      .then(res => {
        this.setState({
          docList: res.data.reverse(),
          loading: false
        });
      })
      .catch(error => {
        // console.log(error);
      });
  };

  renderDocsList = () => {
    if (!this.state.docList.length) {
      return (
        <div className="loader hljs">
          <span>&#123;</span>
          <span>&#125;</span>
        </div>
      )
    } else {
      return this.state.docList.map((d, idx) => (
        <div className="public-list-item" key={idx}>
          <Link to={`/${d.key}`}>
            <div className="public-paste">
              <Condition value={d.title} className="title" default="Untitled" />
              <Condition value={d.name} className="from-name" />
              <div className="created">({moment(d.created).fromNow()})</div>
            </div>
          </Link>
        </div>
      ));
    }
  };


  render() {
    return (
      <div className={`public-list-view flex-container ${this.context.styleStore.theme}`}>
        <HeaderBlock
          disabled={{ raw: true, edit: true, save: true }}
        />
        <div className="view-container">
          {this.renderDocsList()}
        </div>
      </div>
    );
  }
}

PublicListView.contextTypes = {
  styleStore: React.PropTypes.object
};

export default PublicListView;

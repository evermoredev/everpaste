import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';

import { HeaderBlock } from '../blocks';
import { doRequest } from '../../modules/request';
import { Condition } from '../../modules/components';

/**
 * View for a list of all pastes that have "public" privacy settings
 */
class PublicListView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      docList: [],
      loading: true
    };
  }

  // Once the component mounts, make the api request for the list of docs
  componentWillMount() {
    this.getDocList();
  }

  getDocList = () => {
    doRequest({ url: '/api/list' })
      .then(data => {
        this.setState({
          docList: (data || []).reverse(),
          loading: false
        });
      })
      .catch(error => {
        // console.log(error);
      });
  };

  renderDocsList = () => this.state.docList.map((d, idx) => (
    <div className="public-list-item" key={idx}>
      <Link to={`/${d.key}`}>
        <div className="public-paste">
          <Condition value={d.title} className="title" default="Untitled" />
          <Condition value={d.name} className="from-name" />
          <div className="created">
            ({moment(d.createdAt).from(moment())})
          </div>
        </div>
      </Link>
    </div>
  ));

  render() {
    return (
      <div className={
        `public-list-view flex-container ${this.context.styleStore.theme.className}`
      }>
        <HeaderBlock
          disabled={{ raw: true, edit: true, save: true }}
        />
        <div className="view-container">
          <Condition condition={this.state.loading}>
            <div className="loader hljs">
              <span>&#123;</span>
              <span>&#125;</span>
            </div>
          </Condition>
          <Condition condition={!this.state.loading}>
            <div>{this.renderDocsList()}</div>
          </Condition>
        </div>
      </div>
    );
  }

}

PublicListView.contextTypes = {
  styleStore: React.PropTypes.object
};

export default PublicListView;

import React from 'react';
import { observer } from 'mobx-react';
import PublicListViewStore from './PublicListViewStore';
import { Link } from 'react-router';
import moment from 'moment';


@observer(['AppStore', 'ViewsStore'])
class PublicListView extends React.Component {

  constructor(props) {
    super(props);
  }

  // Once the component mounts, make the api request for the list of docs
  componentWillMount() {
    this.store = new PublicListViewStore(this.props);
    this.store.getDocList();
  }

  componentWillReact() {
    this.store.setCurrentView();
  }

  renderDocsList = () => {
    if (this.store.loading) {
      return (
        <div className="loader hljs">
          <span>&#123;</span>
          <span>&#125;</span>
        </div>
      )
    } else {
      return this.store.docList.map((d, idx) => (
        <div className="doc-list-item" key={idx}>
          <Link to={`/${d.key}`}>
            <div className="public-paste">
              <span className="title hljs-keyword">
                {d.title || 'Untitled'}
              </span>
              {d.name &&
                <span className="from-name hljs-title">from {d.name}</span>
              }
              <span className="created hljs-string">
                ({moment(d.created).fromNow()})
              </span>
            </div>
          </Link>
        </div>
      ));
    }
  };


  render() {
    return (
      <div className="public-list-view hljs">
        <div className="code-document">
          {this.renderDocsList()}
        </div>
      </div>
    );
  }
}

export default PublicListView;

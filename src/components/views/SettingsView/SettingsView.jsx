import React from 'react';
import { observer } from 'mobx-react';

import { HeaderLayout } from 'components/layouts';

@observer(['GlobalStore', 'StyleStore'])
class SettingsView extends React.Component {

  constructor(props) {
    super(props);

    this.props.GlobalStore.currentView = 'SettingsView';
  }

  handleThemeChange = (event, className) => {
    this.props.StyleStore.setTheme(className);
  };

  renderThemesList = () => this.props.StyleStore.themes.map((t, idx) =>
    <div
      key={idx}
      className={`${t.className} theme-selection`}
      onClick={(event) => this.handleThemeChange(event, t.className)}>
        {t.name}
    </div>
  );

  renderSampleCode = () => {
    return (
      <div className="settings-code-document">
        <pre>
          <code>
            <table className="code-table hljs">
              <tbody>
                <tr className="code-row"><td className="line-number unselectable">1</td><td className="code-col">import java.io.*; </td></tr>
                <tr className="code-row"><td className="line-number unselectable">2</td><td className="code-col"><span className="hljs-keyword">class</span> <span className="hljs-title">MyFirstProgram</span> {`{`}</td></tr>
                <tr className="code-row"><td className="line-number unselectable">3</td><td className="code-col">&nbsp;&nbsp;<span className="hljs-comment">/** Print a hello message */</span> </td></tr>
                <tr className="code-row"><td className="line-number unselectable">4</td><td className="code-col">&nbsp;&nbsp;<span className="hljs-function"><span className="hljs-keyword">public</span> <span className="hljs-keyword">static</span> <span className="hljs-keyword">void</span> <span className="hljs-title">main</span>(<span className="hljs-params">String[] args</span>) </span>{`{`} </td></tr>
                <tr className="code-row"><td className="line-number unselectable">5</td><td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;BufferedReader <span className="hljs-keyword">in</span> = </td></tr>
                <tr className="code-row"><td className="line-number unselectable">6</td><td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="hljs-keyword">new</span> BufferedReader(<span className="hljs-keyword">new</span> InputStreamReader(System.<span className="hljs-keyword">in</span>)); </td></tr>
                <tr className="code-row"><td className="line-number unselectable">7</td><td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;String name = <span className="hljs-string">"Instructor"</span>; </td></tr>
                <tr className="code-row"><td className="line-number unselectable">8</td><td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;System.<span className="hljs-keyword">out</span>.print(<span className="hljs-string">"Give your name: "</span>); </td></tr>
                <tr className="code-row"><td className="line-number unselectable">9</td><td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;<span className="hljs-keyword">try</span> {`{`}name = <span className="hljs-keyword">in</span>.readLine();}</td></tr>
                <tr className="code-row"><td className="line-number unselectable">10</td><td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="hljs-keyword">catch</span>(Exception e) {`{`}</td></tr>
                <tr className="code-row"><td className="line-number unselectable">11</td><td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.<span className="hljs-keyword">out</span>.println(<span className="hljs-string">"Caught an exception!"</span>); </td></tr>
                <tr className="code-row"><td className="line-number unselectable">12</td><td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</td></tr>
                <tr className="code-row"><td className="line-number unselectable">13</td><td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;System.<span className="hljs-keyword">out</span>.println(<span className="hljs-string">"Hello "</span> + name + <span className="hljs-string">"!"</span>); </td></tr>
                <tr className="code-row"><td className="line-number unselectable">14</td><td className="code-col">&nbsp;&nbsp;}</td></tr>
                <tr className="code-row"><td className="line-number unselectable">15</td><td className="code-col">}</td></tr>
                <tr className="code-row"><td className="line-number unselectable">16</td><td className="code-col"></td></tr>
              </tbody>
            </table>
          </code>
        </pre>
      </div>
    )
  };

  render() {
    return(
      <div className="settings-view">
        <HeaderLayout />
        <h2 className="settings-header">Select a Theme Below</h2>
        <div className="sample-code">
          {this.renderSampleCode()}
        </div>
        <div className="settings-sub-header">Current Theme: {this.props.StyleStore.themeDisplayName}</div>
        <div className="theme-container">
          {this.renderThemesList()}
        </div>
      </div>
    );
  }

}

export default SettingsView;

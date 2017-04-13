import React from 'react';
import { HeaderBlock } from '../blocks';

class SettingsView extends React.Component {

  constructor(props) {
    super(props);
  }

  handleThemeChange = (event, themeName) => {
    this.context.styleStore.setTheme(themeName);
    this.forceUpdate();
  };

  renderThemesList = () => {
    const themes = this.context.styleStore.themes;
    return Object.keys(themes).map((k, idx) =>
      <div
        key={idx}
        className={`${themes[k]} theme-selection`}
        onClick={(event) => this.handleThemeChange(event, k)}>
        {k}
      </div>
    );
  };

  renderSampleCode = () => {
    return (
      <div className="settings-code-document">
        <pre>
          <code>
            <table className="code-table hljs">
              <tbody>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">import java.io.*; </td>
                </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">
                    <span className="hljs-keyword">class </span>
                    <span className="hljs-title">MyFirstProgram</span> {`{`}
                  </td>
                </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">&nbsp;&nbsp;
                    <span className="hljs-comment">/** Print a hello message */</span>
                  </td>
                </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">&nbsp;&nbsp;
                    <span className="hljs-function">
                      <span className="hljs-keyword">public </span>
                      <span className="hljs-keyword">static </span>
                      <span className="hljs-keyword">void </span>
                      <span className="hljs-title">main</span>
                      (<span className="hljs-params">String[] args</span>)
                    </span>{`{`}
                  </td>
                 </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;BufferedReader
                   <span className="hljs-keyword">in</span> =
                  </td>
                 </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="hljs-keyword">new</span> BufferedReader
                    (<span className="hljs-keyword">new</span> InputStreamReader(System.
                    <span className="hljs-keyword">in</span>));
                  </td>
                </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;String name =
                    <span className="hljs-string">"Instructor"</span>;
                  </td>
                </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;System.
                    <span className="hljs-keyword">out</span>.print(
                    <span className="hljs-string">"Give your name: "</span>);
                  </td>
                </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="hljs-keyword">try</span> {`{`}name =
                    <span className="hljs-keyword">in</span>.readLine();}
                  </td>
                </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="hljs-keyword">catch</span>(Exception e) {`{`}
                  </td>
                </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.
                    <span className="hljs-keyword">out</span>.println(
                    <span className="hljs-string">"Caught an exception!"</span>);
                  </td>
                </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</td>
                </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">&nbsp;&nbsp;&nbsp;&nbsp;System.
                    <span className="hljs-keyword">out</span>.println(
                    <span className="hljs-string">"Hello "</span> + name +
                    <span className="hljs-string">"!"</span>);
                  </td>
                </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">&nbsp;&nbsp;}</td>
                </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col">}</td>
                </tr>
                <tr className="code-row">
                  <td className="line-number"></td>
                  <td className="code-col"> </td>
                </tr>
              </tbody>
            </table>
          </code>
        </pre>
      </div>
    )
  };

  render() {
    return(
      <div className={`settings-view flex-container ${this.context.styleStore.theme.className}`}>
        <HeaderBlock disabled={{ raw: true, edit: true, save: true }} />
        <div className="view-container">
          <h2 className="settings-header">Select a Code Theme Below</h2>
          <div className="sample-code">{this.renderSampleCode()}</div>
          <div className="settings-sub-header">
            Current Theme: {this.context.styleStore.theme.name}
          </div>
          <div className="theme-container">{this.renderThemesList()}</div>
        </div>
      </div>
    );
  }

}

SettingsView.contextTypes = {
  styleStore: React.PropTypes.object
};

export default SettingsView;

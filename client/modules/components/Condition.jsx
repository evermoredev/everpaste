import React from 'react';

/**
 * Option 1:
 * If props contains a 'value' key, we will only render a span with that value
 *   if it exists. If a default is provided, render a span with the default
 *   value instead.
 *
 *   example:
 *     <Condition value={this.state.title} default="Untitled" />
 *
 *   This allows for easy shorthand that will only display a div if the value
 *   exists. We can add all the props a div could have like className and style.
 *
 * Option 2:
 * If props contains a 'condition' key, display all children if that condition
 *   is true.
 *
 *   example:
 *     <Condition condition={this.state.special == 'specialForm'}>
 *       <form>
 *         <input type="text" name="special">
 *       </form>
 *     </Condition>
 *
 *     In this example we display all the children element of Condition (the form)
 *     if the condition being passed in is true. This is a lot cleaner in jsx than
 *     curly braces everywhere.
 */
class Condition extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    if ('value' in this.props && 'condition' in this.props) {
      throw Error('Condition cannot have both a value and condition prop.');
    }
    // Grab the props that can be applied to divs
    const { className, style, key, value, condition } = this.props;

    // Option 1: If the value key exists
    if ('value' in this.props) {
      return (value || this.props.default) ?
        <span
          key={key}
          style={style}
          className={className}>
          {value || this.props.default}
        </span> : null;
    }

    // Option 2: If the condition exists
    if ('condition' in this.props) {
      return (condition) ?
        <span
          key={key}
          style={style}
          className={className}>
          {this.props.children}
        </span> : null;
    }

    throw Error('Condition element needs either a value or condition prop.');
  }

}

export default Condition;

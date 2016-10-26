import { observable } from 'mobx';

/**
 * Creates the initial state and does any manipulation
 * if needed and then sends it in our provider.
 */
class StateStore {

  @observable state = {};

  constructor(initialState) {
    if (initialState.isInitial === true) {
      this.state = initialState;
    } else {
      this.state = {
        initialState: 'No Initial State Provided'
      };
    }
  }

}

export default StateStore;

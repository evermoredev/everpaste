/**
 * ViewsStore is a class of global observable items that individual view
 * components can modify. View components with observable items only used
 * within that single component should be handled in the Store class local to
 * that View component's folder.
 *
 * An example of needing to modify items here, would be when a View component's
 * properties or actions affect a parent or sibling component. Rendering the
 * PasteView component changes the definition of the SaveButton action in the
 * HeaderBlock component. The ReadView component, when rendered, will replace
 * the ViewsStore 'current' object with it's own set of items. Now the
 * HeaderBlock component only cares whether or not the current.item exists and
 * does not need to know where it came from.
 */

import { observable, action } from 'mobx';

class ViewsStore {

  /**
   * Think of the 'current' object like a constructor. Though ViewsStore
   * will only be created once, each single View component will replace the
   * 'current' object with it's own. The other observable variables in this
   * class will have values that we won't want to be reset every time an
   * individual view changes. For example, a counter variable that keeps track
   * of how many times a single View component has been created.
   */
  @observable current = {};

}

export default new ViewsStore();

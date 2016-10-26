import AuthStore from './AuthStore';
import ViewStore from './ViewStore';
import StateStore from './StateStore';

export {
  AuthStore,
  StateStore,
  ViewStore
};

/**
 * In general there are three ways in which you can pass stores in MobX
 *
 * 1. Explicitly via props. Easy to test and clear to follow, but can
 *    become clumsy when you have deeply nested structures or many stores
 *    (you can solve the latter by having a store for stores)
 *
 * 2. Import stores in the components directly and just use them :) It's
 *    the MVP of passing stores around, but stand alone testing of components
 *    becomes tricky quickly as you have to make sure your global stores are
 *    in the right state first.
 *
 * 3. Pass stores around via React's context mechanism. Redux's Provider uses
 *    that, as does the mobx-connect package. Context is passed implicitly and
 *    deep component can extract data out of the context, but it is still easy
 *    to test as you only have to make sure you set up some context before
 *    testing the component. UPDATE: Provider is available now!
 *
 *    Using the Provider for example: @observer(["store"])
 *
 * 4. If a component ask a store and receives a store via a property with
 *    the same name, the property takes precedence. Use this to your advantage
 *    when testing! We can also pluck out specific objects that our store
 *    provides like this: @observer(["store"], ({ colors, label, onClick })) =>
 *
 * 5. Values provided through Provider should be final, to avoid issues like
 *    mentioned in React #2517 and React #3973, where optimizations might stop
 *    the propagation of new context. Instead, make sure that if you put
 *    things in context that might change over time, that they are @observable
 *    or provide some other means to listen to changes, like callbacks.
 **/
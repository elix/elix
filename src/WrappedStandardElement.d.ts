// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

import * as symbols from './symbols.js';
import DelegateFocusMixin from './DelegateFocusMixin.js';
import ReactiveElement from './ReactiveElement.js';

export default class WrappedStandardElement extends DelegateFocusMixin(
  ReactiveElement
) {

  [symbols.defaultTabIndex]: number;

  /**
   * Returns a reference to the inner standard HTML element.
   */
  readonly inner: HTMLElement;

  setInnerProperty(name: string, value: any): void;

  /**
   * Creates a class that wraps a standard HTML element.
   *
   * Note that the resulting class is a subclass of WrappedStandardElement, not
   * the standard class being wrapped. E.g., if you call
   * `WrappedStandardElement.wrap('a')`, you will get a class whose shadow tree
   * will include an anchor element, but the class will *not* inherit from
   * HTMLAnchorElement.
   *
   * @param {string} extendsTag - the standard HTML element tag to extend
   */
  static wrap(extendsTag: string): Constructor<WrappedStandardElement>;

}

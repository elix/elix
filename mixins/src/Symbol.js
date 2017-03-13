/* The number of fake symbols we've served up */
let count = 0;

function uniqueString(description) {
  return `_${description}${count++}`;
}

const symbolFunction = typeof window.Symbol === 'function' ?
  window.Symbol :
  uniqueString;

/**
 * Polyfill for ES6 symbol class.
 *
 * Mixins and component classes often want to associate private data with an
 * element instance, but JavaScript does not have direct support for true
 * private properties. One approach is to use the
 * [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
 * data type to set and retrieve data on an element.
 *
 * Unfortunately, the Symbol type is not available in Internet Explorer 11. In
 * lieu of returning a true Symbol, this polyfill returns a different string
 * each time it is called.
 *
 * Usage:
 *
 *     const fooSymbol = Symbol('foo');
 *
 *     class MyElement extends HTMLElement {
 *       get foo() {
 *         return this[fooSymbol];
 *       }
 *       set foo(value) {
 *         this[fooSymbol] = value;
 *       }
 *     }
 *
 * In IE 11, this sample will "hide" data behind an instance property that looks
 * like this._foo0. The underscore is meant to reduce (not eliminate) potential
 * accidental access, and the unique number at the end is mean to avoid (not
 * eliminate) naming conflicts.
 *
 * @function Symbol
 * @param {string} description - A string to identify the symbol when debugging
 * @returns {Symbol|string} — A Symbol (in ES6 browsers) or unique string ID (in
 * ES5).
 */
export default symbolFunction;

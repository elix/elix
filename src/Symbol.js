/* The number of fake symbols we've served up */
let count = 0;

/*
 * A helper function for simulating instances of the `Symbol` class in older
 * browsers, notably Microsoft Internet Explorer 11.
 *
 * Mixins and component classes often want to associate private data with an
 * element instance, but JavaScript does not have direct support for true
 * private properties. Elix uses `Symbol` instances as property keys to set and
 * retrieve data on an element. This prevents accidental name collisions. While
 * it does not make the properties completely private, it does make them
 * somewhat harder to access, and hopefully discourages outside code from
 * directly manipulating the properties.
 *
 * In modern browsers that support `Symbol`, the Elix `Symbol` helper function
 * simply returns a real `Symbol` instance. In browsers like IE that do not have
 * support for `Symbol`, the Elix `Symbol` helper function returns a different
 * string each time it is called.
 *
 * Usage:
 *
 *     const fooKey = Symbol('foo');
 *
 *     class MyElement extends HTMLElement {
 *       get foo() {
 *         return this[fooKey];
 *       }
 *       set foo(value) {
 *         this[fooKey] = value;
 *       }
 *     }
 *
 * In IE 11, this sample will "hide" data behind an instance property that looks
 * like `this._foo0`, `this._foo1`, etc. The underscore is meant to reduce (not
 * eliminate) potential accidental access, and the unique number at the end is
 * mean to avoid (not eliminate) naming conflicts.
 *
 * Note: Because IE 11 support is provisional, we're not including this class
 * in our project documentation. This comment includes jsDoc annotations so
 * project members can understand how to call it, but the comment itself will
 * not be picked up by jsDoc.
 * 
 * @function Symbol
 * @param {any} description - A string to identify the symbol when debugging
 * @returns {symbol|string} - A Symbol (in ES6 browsers) or unique string ID (in
 * ES5).
 */
export default function(description) {
  return typeof Symbol === 'function' ?
    Symbol(description) :
    uniqueString(description);
}

// Include the given description in a unique string.
function uniqueString(description) {
  return `_${description}${count++}`;
}

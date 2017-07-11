import Symbol from './Symbol.js';


const webkitUserSelectKey = Symbol('webkitUserSelect');


// Determine whether we're in a sufficiently old version of WebKit that we need
// to apply a fix for style updates. This can't be determined via feature
// detection, so we have to explicitly inspect the browser version.
const browserVersionMatch = /AppleWebKit\/([\d.]+)/.exec(navigator.userAgent);
const needsForceFix = /Apple Computer/.test(navigator.vendor) && browserVersionMatch && parseInt(browserVersionMatch[1]) <= 603;


/**
 * This function works around a bug in the initial Shadow DOM implementation in
 * Apple Safari and Mobile Safari:
 * https://bugs.webkit.org/show_bug.cgi?id=170762. This bug prevents component
 * CSS from correctly applying style rules that depend on CSS classes or
 * attributes applied to the component host. This bug was fixed in WebKit
 * version 604, but older WebKit versions need this fix.
 * 
 * The fix entails forcing a temporary change in a CSS property on the component
 * that will force a style recalc. For this purpose, the "-webkit-user-select"
 * property is used. In the next tick, we revert that change.
 *  
 * @param {HTMLElement} element 
 */
export function webkitForceStyleUpdate(element) {
  // Only do our fix if we're in an old version of WebKit and we're not already
  // set up to do the fix.
  if (needsForceFix && element[webkitUserSelectKey] == null) {
    // Get the current value of -webkit-user-select directly on the component.
    element[webkitUserSelectKey] = element.style.webkitUserSelect || '';
    const effectiveWebkitUserSelect = getComputedStyle(element).webkitUserSelect;
    // Apply a value for -webkit-user-select that differs from the current
    // value.
    element.style.webkitUserSelect = effectiveWebkitUserSelect === 'none' ?
      'text' :
      'none';
    setTimeout(() => {
      // Revert the change.
      element.style.webkitUserSelect = element[webkitUserSelectKey];
      element[webkitUserSelectKey] = null;
    });
  }
}

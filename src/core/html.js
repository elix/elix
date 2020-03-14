/**
 * A helper for creating a DocumentFragment in JavaScript.
 *
 * @module html
 */

/**
 * A JavaScript template string literal that returns an HTML document fragment.
 *
 * Example:
 *
 *     const fragment = html`Hello, <em>world</em>.`
 *
 * returns a `DocumentFragment` whose `innerHTML` is `Hello, <em>world</em>.`
 *
 * This function is called `html` so that it can be easily used with HTML
 * syntax-highlighting extensions for various popular code editors.
 *
 * See also [template.html](template#html), which returns a similar result but
 * as an HTMLTemplateElement.
 *
 * @param {TemplateStringsArray} strings - the strings passed to the JavaScript template
 * literal
 * @param {string[]} substitutions - the variable values passed to the
 * JavaScript template literal
 * @returns {DocumentFragment}
 */
function html(strings, ...substitutions) {
  const template = document.createElement("template");
  template.innerHTML = String.raw(strings, ...substitutions);
  return template.content;
}

export default html;

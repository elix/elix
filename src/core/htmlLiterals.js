/**
 * JavaScript template literals for constructing DOM nodes from HTML
 *
 * @module html
 */

/**
 * A JavaScript template string literal that returns an HTML document fragment.
 *
 * Example:
 *
 *     const fragment = fragmentFrom.html`Hello, <em>world</em>.`
 *
 * returns a `DocumentFragment` whose `innerHTML` is `Hello, <em>world</em>.`
 *
 * This function is called `html` so that it can be easily used with HTML
 * syntax-highlighting extensions for various popular code editors.
 *
 * See also [templateFrom.html](template#html), which returns a similar result but
 * as an HTMLTemplateElement.
 *
 * @param {TemplateStringsArray} strings - the strings passed to the JavaScript template
 * literal
 * @param {string[]} substitutions - the variable values passed to the
 * JavaScript template literal
 * @returns {DocumentFragment}
 */
export const fragmentFrom = {
  html(strings, ...substitutions) {
    return templateFrom.html(strings, ...substitutions).content;
  },
};

/**
 * A JavaScript template string literal that returns an HTML template.
 *
 * Example:
 *
 *     const myTemplate = templateFrom.html`Hello, <em>world</em>.`
 *
 * returns an `HTMLTemplateElement` whose `innerHTML` is `Hello, <em>world</em>.`
 *
 * This function is called `html` so that it can be easily used with HTML
 * syntax-highlighting extensions for various popular code editors.
 *
 * See also [html](html), a helper which returns a similar result but as an
 * DocumentFragment.
 *
 * @param {TemplateStringsArray} strings - the strings passed to the JavaScript template
 * literal
 * @param {string[]} substitutions - the variable values passed to the
 * JavaScript template literal
 * @returns {HTMLTemplateElement}
 */
export const templateFrom = {
  html(strings, ...substitutions) {
    const template = document.createElement("template");
    template.innerHTML = String.raw(strings, ...substitutions);
    return template;
  },
};

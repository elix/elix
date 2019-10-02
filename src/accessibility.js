/**
 * Helpers related to universal accessibility
 *
 * Universal accessibility is a core goal of the Elix project. These helpers are
 * used by mixins like [AriaListMixin](AriaListMixin) and
 * [AriaMenuMixin](AriaMenuMixin) to support accessibility via ARIA.
 *
 * @module accessibility
 */

/**
 * A dictionary mapping built-in HTML elements to their default ARIA role.
 *
 * Example: `defaultAriaRole.ol` returns "list", since the default ARIA role
 * for an `ol` (ordered list) element is "list".
 */
export const defaultAriaRole = {
  a: 'link',
  article: 'region',
  button: 'button',
  h1: 'sectionhead',
  h2: 'sectionhead',
  h3: 'sectionhead',
  h4: 'sectionhead',
  h5: 'sectionhead',
  h6: 'sectionhead',
  hr: 'sectionhead',
  iframe: 'region',
  link: 'link',
  menu: 'menu',
  ol: 'list',
  option: 'option',
  output: 'liveregion',
  progress: 'progressbar',
  select: 'select',
  table: 'table',
  td: 'td',
  textarea: 'textbox',
  th: 'th',
  ul: 'list'
};

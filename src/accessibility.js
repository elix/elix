/**
 * This module provides helpers related to universal accessibility, a core goal
 * of the Elix project.
 * 
 * @module accessibility
 */


/**
 * A dictionary mapping built-in HTML elements to their default ARIA role.
 * 
 * Example: `defaultAriaRole.ol` returns "list", since the default ARIA role
 * for an `ol` (ordered list) element is "list".
 * 
 * This dictionary is used by [AriaListMixin](AriaListMixin) and
 * [AriaMenuMixin](AriaMenuMixin) to determine an appropriate default role
 * for list items in components using those mixins.
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

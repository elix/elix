/**
 * A helper for creating a DocumentFragment in JavaScript.
 *
 * @module html
 */

import { fragmentFrom } from "./htmlLiterals.js";

export default function html(strings, ...substitutions) {
  /* eslint-disable no-console */
  console.warn(
    `The html helper has moved to htmlLiterals.js, and is now called \`fragmentFrom.html\`. Please update your imports.`
  );
  return fragmentFrom.html(strings, ...substitutions);
}

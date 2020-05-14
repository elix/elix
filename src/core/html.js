/**
 * A helper for creating a DocumentFragment in JavaScript.
 *
 * @module html
 */

import { fragmentFrom } from "./htmlLiterals.js";

export default fragmentFrom.html;

/* eslint-disable no-console */
console.warn(
  `The html helper has moved to htmlLiterals.js, and is now called \`templateFrom.html\`. Please update your imports.`
);

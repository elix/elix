/**
 * A helper for creating a DocumentFragment in JavaScript.
 *
 * @module html
 */

import { fragmentFrom as html } from "./htmlLiterals.js";

export default html;

/* eslint-disable no-console */
console.warn(
  `The html helper has been moved to htmlLiterals.js. Please update your imports.`
);

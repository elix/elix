// The template.js helpers file is being renamed to templating.js. Update your
// imports to refer to templating.js. During this transition, this file provides
// the same features and a console warning about the rename.

import * as templating from "./templating.js";

export const createElement = templating.createElement;
export const html = templating.html;
export const replace = templating.replace;
export const transmute = templating.transmute;

/* eslint-disable no-console */
console.warn(
  `The template.js file is being renamed to templating.js. Please update your imports.`
);

// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

import * as internal from './internal.js';

declare const TouchSwipeMixin: StateMixin<
  {},
  {},
  {
    [internal.swipeTarget]: HTMLElement;
  },
  {
    swipeFraction: number;
  }
>;

export default TouchSwipeMixin;

// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

import * as symbols from './symbols.js';

declare const TouchSwipeMixin: StateMixin<{}, {},
  {
    [symbols.swipeTarget]: HTMLElement;
  },
  {
    swipeFraction: number
  }
>;

export default TouchSwipeMixin;

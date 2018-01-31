// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

import * as symbols from './symbols.js';

declare const SwipeDirectionMixin: Mixin<{}, {
  // Uncomment these once TypeScript can deal with them.
  // [symbols.swipeLeft](): void;
  // [symbols.swipeRight](): void;
}>;

export default SwipeDirectionMixin;

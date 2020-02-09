// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

import * as internal from "./internal.js";

declare const SwipeDirectionMixin: Mixin<
  {},
  {
    // Uncomment these once TypeScript can deal with them.
    // [internal.swipeLeft](): void;
    // [internal.swipeRight](): void;
  }
>;

export default SwipeDirectionMixin;

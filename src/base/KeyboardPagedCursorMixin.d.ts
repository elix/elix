// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

import { scrollTarget } from "./internal.js";

declare const KeyboardPagedCursorMixin: Mixin<
  {},
  {
    pageDown(): boolean;
    pageUp(): boolean;
    [scrollTarget]: Element;
  }
>;

export default KeyboardPagedCursorMixin;

// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

import { goFirst, goLast, goNext, goPrevious } from "./internal.js";

declare const DelegateCursorMixin: Mixin<
  {},
  {
    [goNext](): boolean;
    [goPrevious](): boolean;
    [goFirst](): boolean;
    [goLast](): boolean;
  }
>;

export default DelegateCursorMixin;

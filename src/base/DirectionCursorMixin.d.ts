// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

import { goDown, goEnd, goLeft, goRight, goStart, goUp } from "./internal.js";

declare const DirectionCursorMixin: Mixin<
  {},
  {
    [goDown](): boolean;
    [goEnd](): boolean;
    [goLeft](): boolean;
    [goRight](): boolean;
    [goStart](): boolean;
    [goUp](): boolean;
  }
>;

export default DirectionCursorMixin;

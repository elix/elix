// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../src/shared.d.ts"/>

import * as symbols from './symbols.js';

declare const DirectionSelectionMixin: Mixin<{}, {
  [symbols.canGoLeft]: boolean;
  [symbols.canGoRight]: boolean;
  [symbols.goDown](): boolean;
  [symbols.goEnd](): boolean;
  [symbols.goLeft](): boolean;
  [symbols.goRight](): boolean;
  [symbols.goStart](): boolean;
  [symbols.goUp](): boolean;
}>;

export default DirectionSelectionMixin;

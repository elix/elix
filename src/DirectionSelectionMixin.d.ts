// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

import * as symbols from './symbols.js';

declare const DirectionSelectionMixin: Mixin<{}, {
  [symbols.goDown](): boolean;
  [symbols.goEnd](): boolean;
  [symbols.goLeft](): boolean;
  [symbols.goRight](): boolean;
  [symbols.goStart](): boolean;
  [symbols.goUp](): boolean;
}>;

export default DirectionSelectionMixin;

// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

import * as symbols from './symbols.js';

declare const KeyboardPagedSelectionMixin: Mixin<{
  items?: Element[];
  pageDown?(): boolean;
  pageUp?(): boolean;
  selectedIndex?: number;
}, {
  pageDown(): boolean;
  pageUp(): boolean;
  [symbols.scrollTarget]: Element;
}>;

export default KeyboardPagedSelectionMixin;

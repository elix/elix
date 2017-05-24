// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../elix.d.ts"/>

declare const KeyboardPagedSelectionMixin: Mixin<{
  items?: Element[];
  pageDown?(): boolean;
  pageUp?(): boolean;
  selectedIndex?: number;
}, {
  pageDown(): boolean;
  pageUp(): boolean;
}>;

export default KeyboardPagedSelectionMixin;

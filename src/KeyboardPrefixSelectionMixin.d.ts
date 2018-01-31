// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

declare const KeyboardPrefixSelectionMixin: Mixin<{
  selectedIndex?: number;
  selectItemWithTextPrefix?(prefix: string): boolean;
}, {
  selectedIndex: number;
  selectItemWithTextPrefix(prefix: string): boolean;
}>;

export default KeyboardPrefixSelectionMixin;

// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

import * as symbols from './symbols.js';

declare const SelectionInViewMixin: Mixin<{}, {
  scrollItemIntoView(item: Element): void;
  [symbols.scrollTarget]: Element
}>;

export default SelectionInViewMixin;

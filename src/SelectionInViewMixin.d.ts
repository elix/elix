// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

import * as symbols from './symbols.js';

declare const SelectionInViewMixin: Mixin<{
  componentDidMount?(): void;
  componentDidUpdate?(previousState: PlainObject): void;
  scrollItemIntoView?(item: Element);
}, {
  componentDidMount(): void;
  componentDidUpdate(previousState: PlainObject): void;
  scrollItemIntoView(item: Element);
  [symbols.scrollTarget]: Element
}>;

export default SelectionInViewMixin;

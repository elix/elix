// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../utilities/shared.d.ts"/>

declare const SelectionInViewMixin: Mixin<{
  connectedCallback?(): void;
  scrollItemIntoView?(item: Element);
  selectedItem?: Element;
}, {
  connectedCallback(): void;
  scrollItemIntoView(item: Element);
  selectedItem: Element;
}>;

export default SelectionInViewMixin;

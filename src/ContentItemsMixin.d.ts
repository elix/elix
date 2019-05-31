// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

declare const ContentItemsMixin: StateMixin<{}, {},
  {
    items: (HTMLElement|SVGElement)[];
  },
  {
    items: (HTMLElement|SVGElement)[];
  }
>;

export default ContentItemsMixin;

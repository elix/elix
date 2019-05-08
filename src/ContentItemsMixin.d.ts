// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

declare const ContentItemsMixin: StateMixin<{
},
{},
{
  items: (HTMLElement|SVGElement)[];
  originalItemAttributes(item: Element): PlainObject;
},
{
  items: (HTMLElement|SVGElement)[];
}>;

export default ContentItemsMixin;

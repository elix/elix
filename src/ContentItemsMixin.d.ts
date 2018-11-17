// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

declare const ContentItemsMixin: StateMixin<{
  items?: Element[];
},
{},
{
  itemMatchesInState(item: Element, state: PlainObject): boolean;
  items: Element[];
  itemsForState(state: PlainObject): Element[];
  itemUpdates(item: Element, calcs: PlainObject, original: PlainObject): PlainObject;
},
{
  items: Element[];
}>;

export default ContentItemsMixin;

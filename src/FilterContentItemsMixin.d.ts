// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

declare const FilterContentItemsMixin: StateMixin<{
  items?: Element[];
},
{},
{
  filter: string;
  itemUpdates(item: Element, calcs: PlainObject, original: PlainObject): PlainObject;
  items: Element[];
  itemsForState(state: PlainObject): Element[]
},
{
  items: Element[];
}>;

export default FilterContentItemsMixin;

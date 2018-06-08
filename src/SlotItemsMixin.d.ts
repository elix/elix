// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

import * as symbols from './symbols.js';

declare const SlotItemsMixin: StateMixin<
{
  componentDidMount?(): void;
  items?: Element[];
},
{},
{
  componentDidMount(): void;
  [symbols.contentSlot]: HTMLSlotElement;
  itemUpdates(item: Element, calcs: PlainObject, original: PlainObject): PlainObject;
  items: Element[];
  itemsForState(state: PlainObject): Element[]
},
{
  content: Node[];
  items: Element[];
}>;

export default SlotItemsMixin;

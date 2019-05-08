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
  [symbols.contentSlot]: HTMLSlotElement;
  componentDidMount(): void;
  items: Element[];
  itemUpdates(item: Element, calcs: PlainObject, original: PlainObject): PlainObject;
  originalItemAttributes(item: Element): PlainObject;
},
{
  content: Node[];
  items: Element[];
}>;

export default SlotItemsMixin;

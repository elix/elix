// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

import * as symbols from './symbols.js';

declare const SlotItemsMixin: StateMixin<
{},
{},
{
  [symbols.contentSlot]: HTMLSlotElement;
  componentDidMount(): void;
  items: (HTMLElement|SVGElement)[];
},
{
  content: Node[];
  items: (HTMLElement|SVGElement)[];
}>;

export default SlotItemsMixin;

// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

import * as symbols from './symbols.js';

declare const SlotContentMixin: StateMixin<
{
  componentDidMount?(): void;
},
{},
{
  componentDidMount(): void;
  contentSlot: HTMLSlotElement;
  [symbols.contentSlot]: HTMLSlotElement;
},
{
  content: Node[];
}>;

export default SlotContentMixin;

// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

declare const SlotContentMixin: StateMixin<
{
  componentDidMount?(): void;
},
{},
{
  componentDidMount(): void;
  contentSlot: HTMLSlotElement
},
{
  content: NodeList|Node[];
}>;

export default SlotContentMixin;

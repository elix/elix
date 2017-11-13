// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../src/shared.d.ts"/>

declare const SlotContentMixin: StateMixin<{
  connectedCallback?(): void;
},
{},
{
  connectedCallback(): void;
},
{
  content: NodeList|Node[];
}>;

export default SlotContentMixin;

// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

declare const ItemsTextMixin: StateMixin<{
  items?: Element[];
},
{},
{},
{
  texts: string[];
}>;

declare type GetTextCallback = (item: Node) => string;

export default ItemsTextMixin;
export function getItemText(item: Node): string;
export function getTextsFromItems(items: Node[], getText?: GetTextCallback);

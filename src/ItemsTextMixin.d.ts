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

declare type GetTextCallback = (item: Element) => string;

export default ItemsTextMixin;
export function getItemText(item: Element): string;
export function getTextsFromItems(items: Element[], getText?: GetTextCallback);

// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

declare const ItemsTextMixin: StateMixin<
  {
    items?: Element[];
  },
  {},
  {},
  {
    texts: string[];
  }
>;

declare type GetTextCallback = (item: Node) => string;

export default ItemsTextMixin;
export function getItemText(item: Node): string;
export function getTextsFromItems(
  items: Node[],
  getText?: GetTextCallback
): string[] | null;

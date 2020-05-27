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

declare type GetTextCallback = (item: Element) => string;

export default ItemsTextMixin;
export function getTextsFromItems(
  items: Element[],
  getText: GetTextCallback
): string[] | null;

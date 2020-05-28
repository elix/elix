// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

declare const ItemsMultiSelectMixin: StateMixin<
  {},
  {},
  {},
  {
    selectedItemFlags: boolean[];
    selectedItems: ListItemElement[];
  }
>;

export default ItemsMultiSelectMixin;

export function selectedItemsToFlags(
  items: ListItemElement[],
  selectedItems: ListItemElement[]
): boolean[];

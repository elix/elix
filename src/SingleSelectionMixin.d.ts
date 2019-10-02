// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

declare const SingleSelectionMixin: StateMixin<
  {},
  {},
  {
    canSelectNext: boolean;
    canSelectPrevious: boolean;
    selectedIndex: number;
    selectedItem: Element | null;
    selectFirst(): boolean;
    selectLast(): boolean;
    selectionRequired: boolean;
    selectionWraps: boolean;
    selectNext(): boolean;
    selectPrevious(): boolean;
  },
  {
    selectedIndex: number;
    selectionRequired: boolean;
    selectionWraps: boolean;
  }
>;

export default SingleSelectionMixin;

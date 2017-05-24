// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../elix.d.ts"/>

declare const SingleSelectionMixin: Mixin<{
  canSelectNext?: boolean;
  canSelectPrevious?: boolean;
  items?: Element[];
  selectedIndex?: number;
  selectedItem?: Element|null;
  selectFirst?(): boolean;
  selectLast?(): boolean;
  selectionRequired?: boolean;
  selectionWraps?: boolean;
  selectNext?(): boolean;
  selectPrevious?(): boolean;
}, {
  canSelectNext: boolean;
  canSelectPrevious: boolean;
  selectedIndex: number;
  selectedItem: Element|null;
  selectFirst(): boolean;
  selectLast(): boolean;
  selectionRequired: boolean;
  selectionWraps: boolean;
  selectNext(): boolean;
  selectPrevious(): boolean;
}>;

export default SingleSelectionMixin;

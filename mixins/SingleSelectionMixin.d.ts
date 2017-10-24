// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../utilities/shared.d.ts"/>

declare const SingleSelectionMixin: StateMixin<{
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
},
{},
{
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
  updateSelectedIndex(number): boolean;
},
{
  selectedIndex: number;
  selectionRequired: boolean;
  selectionWraps: boolean;
}>;

export default SingleSelectionMixin;

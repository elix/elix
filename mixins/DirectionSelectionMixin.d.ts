// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../elix.d.ts"/>

declare const AttributeMarshallingMixin: Mixin<{
  selectFirst?(): boolean;
  selectLast?(): boolean;
  selectNext?(): boolean;
  selectPrevious?(): boolean;
}, {
  selectFirst(): boolean;
  selectLast(): boolean;
  selectNext(): boolean;
  selectPrevious(): boolean;
}>;

export default AttributeMarshallingMixin;

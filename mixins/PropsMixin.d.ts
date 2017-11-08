// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../utilities/shared.d.ts"/>

declare const PropsMixin: Mixin<{
  props?: PlainObject;
}, {
  props: PlainObject;
  originalProps: PlainObject;
}>;

export default PropsMixin;

// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

declare const RenderChangesMixin: Mixin<{}, {
  renderOnChange: (dependencies: string | string[], callback: (state: PlainObject, changed: PlainObject) => void) => void
}>;

export default RenderChangesMixin;

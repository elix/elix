// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../utilities/shared.d.ts"/>

declare const BackdropWrapper: Mixin<{}, {
  backdrop: HTMLElement;
}>;

export default BackdropWrapper;

// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../src/shared.d.ts"/>

declare const PopupModalityMixin: StateMixin<{}, {}, {}, {
  role: string
}>;

export default PopupModalityMixin;

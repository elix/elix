// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

declare const GenericMixin: StateMixin<
  {},
  {},
  {
    generic: boolean;
  },
  {
    generic: boolean;
  }
>;

export default GenericMixin;

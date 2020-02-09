// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

declare const DarkModeMixin: StateMixin<
  {},
  {},
  {
    darkMode: boolean | null;
  },
  {
    darkMode: boolean | null;
  }
>;

export default DarkModeMixin;

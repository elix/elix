// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../elix.d.ts"/>

declare const OpenCloseMixin: Mixin<{
  opened?: boolean;
}, {
  close(result?: any): Promise<object>;
  open(): Promise<object>;
  opened: boolean;
  toggle(): void;
}>;

export default OpenCloseMixin;

// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

declare const OpenCloseMixin: StateMixin<
  {},
  {},
  {
    close(result?: any): Promise<void>;
    closed: boolean;
    closeFinished: boolean;
    open(): Promise<void>;
    opened: boolean;
    toggle(opened?: boolean): Promise<void>;
    whenClosed(): Promise<any>;
  },
  {
    opened: boolean;
  }
>;

export default OpenCloseMixin;

// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

declare type ChangeHandler = (
  state: State,
  changed: PlainObject
) => PlainObject | null;

export default class State {
  constructor(defaults?: PlainObject);
  copyWithChanges(changes: PlainObject): { state: State; changed: boolean };
  onChange(dependencies: string[] | string, callback: ChangeHandler): void;
  // State members are generally read-only, but we can't apply `readonly` to
  // them because they can be modified during getDefaultState.
  [key: string]: any;
}

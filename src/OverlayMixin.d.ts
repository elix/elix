// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../src/shared.d.ts"/>

declare const OverlayMixin: StateMixin<{
  connectedCallback?(): void;
  state?: PlainObject;
},
{},
{
  close(result?: any): Promise<void>;
  closed: boolean;
  closeFinished: boolean;
  connectedCallback(): void;
  open(): Promise<void>;
  opened: boolean;
  whenClosed(): Promise<void>;
},
{
  opened: boolean
}
>;

export default OverlayMixin;

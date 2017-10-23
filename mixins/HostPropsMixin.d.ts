// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../utilities/shared.d.ts"/>

declare const HostPropsMixin: Mixin<{}, {
  hostProps(original): any;
}>;

export default HostPropsMixin;

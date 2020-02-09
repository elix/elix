// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

declare const AttributeMarshallingMixin: Mixin<
  {},
  {
    attributeChangedCallback(
      attributeName: string,
      oldValue: string,
      newValue: string
    ): void;
  }
>;

export default AttributeMarshallingMixin;
export const booleanAttributes: { [key: string]: boolean };

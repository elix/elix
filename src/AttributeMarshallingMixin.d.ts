// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../src/shared.d.ts"/>

/** Here is a mixin */
declare const AttributeMarshallingMixin: Mixin<{
  attributeChangedCallback?(attributeName: string, oldValue: string, newValue: string);
  connectedCallback?(): void;
}, {
  attributeChangedCallback(attributeName: string, oldValue: string, newValue: string);
  connectedCallback(): void;
}>;

export default AttributeMarshallingMixin;

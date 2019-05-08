// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>


declare const AttributeMarshallingMixin: Mixin<{
  attributeChangedCallback?(attributeName: string, oldValue: string, newValue: string);
}, {
  attributeChangedCallback(attributeName: string, oldValue: string, newValue: string);
}>;

export default AttributeMarshallingMixin;
export const booleanAttributes: { [key: string]: boolean };

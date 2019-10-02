// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

declare const FormElementMixin: StateMixin<
  {},
  {},
  {
    checkValidity(): void;
    form: HTMLFormElement;
    reportValidity(): void;
    type: string;
    validationMessage: string;
    validity: boolean;
    willValidate: boolean;
  },
  {
    value: string;
  }
>;

export default FormElementMixin;

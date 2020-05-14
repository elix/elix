// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export const fragmentFrom: {
  html(
    strings: TemplateStringsArray,
    ...substitutions: any[]
  ): DocumentFragment;
};

export const templateFrom: {
  html(
    strings: TemplateStringsArray,
    ...substitutions: any[]
  ): HTMLTemplateElement;
};

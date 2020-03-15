// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export function createElement(descriptor: PartDescriptor): Element;
export function html(
  strings: TemplateStringsArray,
  ...substitutions: any[]
): HTMLTemplateElement;
export function replace(original: Node, replacement: Node): Node;
export function transmute(
  original: Element,
  descriptor: PartDescriptor
): Element;

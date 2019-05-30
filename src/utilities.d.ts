// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export function applyChildNodes(element: Node, childNodes: NodeList|Node[]): void;
export function closestFocusableAncestor(element: Element);
export function deepContains(container: Node, target: Node): boolean;
export function firstFocusableElement(root: HTMLElement): HTMLElement;
export function forwardFocus(origin: HTMLElement, target: HTMLElement|null): void;
export function indexOfItemContainingTarget(items: NodeList|Node[], target: Node): number;
export function ownEvent(node: Node, event: Event): boolean;

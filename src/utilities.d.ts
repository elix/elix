// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export function applyChildNodes(
  element: Node,
  childNodes: NodeList | Node[]
): void;
export function closestFocusableNode(element: Element): HTMLElement | null;
export function composedAncestors(node: Node): Iterable<Node>;
export function deepContains(container: Node, target: Node): boolean;
export function ensureId(element: Element): string;
export function firstFocusableElement(root: Node): HTMLElement | null;
export function forwardFocus(
  origin: HTMLElement,
  target: HTMLElement | null
): void;
export function indexOfItemContainingTarget(
  items: NodeList | Node[],
  target: Node
): number;
export function selfAndComposedAncestors(node: Node): Iterable<Node>;
export function ownEvent(node: Node, event: Event): boolean;

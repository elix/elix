// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export function booleanAttributeValue(
  name: string,
  value: string | boolean
): boolean;

export function closestFocusableNode(element: Element): HTMLElement | null;

export function composedAncestors(node: Node): Iterable<Node>;

export function deepContains(container: Node, target: Node): boolean;

export function firstFocusableElement(root: Node): HTMLElement | null;

export function forwardFocus(
  origin: HTMLElement,
  target: HTMLElement | null
): void;

export function indexOfItemContainingTarget(
  items: NodeList | Node[],
  target: Node
): number;

export function ownEvent(node: Node, event: Event): boolean;

export function selfAndComposedAncestors(node: Node): Iterable<Node>;

export function setInternalState(
  element: Element,
  state: string,
  value: boolean
): void;

export const standardBooleanAttributes: { [key: string]: boolean };

export function updateChildNodes(
  element: Node,
  childNodes: NodeList | Node[]
): void;

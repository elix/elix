// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import OpenCloseMixin from './OpenCloseMixin.js';
import OverlayMixin from './OverlayMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SlotContentMixin from './SlotContentMixin.js';

export default class Overlay extends OpenCloseMixin(
  OverlayMixin(SlotContentMixin(ReactiveElement))
) {
  backdrop: Element;
  backdropPartType: PartDescriptor;
  frame: Element;
  framePartType: PartDescriptor;
}

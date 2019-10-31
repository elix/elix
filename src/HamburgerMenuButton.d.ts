// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import Drawer from './Drawer.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SeamlessButton from './SeamlessButton.js';

export default class HamburgerMenuButton extends FocusVisibleMixin(
  KeyboardMixin(OpenCloseMixin(ReactiveElement))
) {
  fromEdge: 'end' | 'left' | 'right' | 'start';
  menuPartType: PartDescriptor;
  menuButtonPartType: PartDescriptor;
}

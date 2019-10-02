// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import Button from './Button.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import GenericMixin from './GenericMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';

export default class TabButton extends FocusVisibleMixin(
  GenericMixin(LanguageDirectionMixin(SlotContentMixin(Button)))
) {
  position: 'bottom' | 'left' | 'right' | 'top';
  selected: boolean;
}

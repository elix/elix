// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import AriaRoleMixin from './AriaRoleMixin.js';
import DelegateFocusMixin from './DelegateFocusMixin.js';
import FormElementMixin from './FormElementMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import PopupSource from './PopupSource.js';

export default class ComboBox extends AriaRoleMixin(
  DelegateFocusMixin(FormElementMixin(KeyboardMixin(PopupSource)))
) {
  input: Element | null;
  inputPartType: PartDescriptor;
  placeholder: string;
  toggleButtonPartType: PartDescriptor;
  value: any;
}

// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import Dialog from './Dialog.js';
import EffectMixin from './EffectMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';
import TransitionEffectMixin from './TransitionEffectMixin.js';

export default class Drawer extends LanguageDirectionMixin(
  TouchSwipeMixin(
    TrackpadSwipeMixin(EffectMixin(TransitionEffectMixin(Dialog)))
  )
) {
  fromEdge: 'bottom' | 'end' | 'left' | 'right' | 'start' | 'top';
}

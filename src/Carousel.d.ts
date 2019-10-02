// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import AriaListMixin from './AriaListMixin.js';
import ArrowDirectionMixin from './ArrowDirectionMixin.js';
import CenteredStripOpacity from './CenteredStripOpacity.js';
import DarkModeMixin from './DarkModeMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import Explorer from './Explorer.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import PageDot from './PageDot.js';
import SlidingStage from './SlidingStage.js';
import SwipeDirectionMixin from './SwipeDirectionMixin.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';

export default class Carousel extends AriaListMixin(
  ArrowDirectionMixin(
    DarkModeMixin(
      DirectionSelectionMixin(
        FocusVisibleMixin(
          KeyboardDirectionMixin(
            KeyboardMixin(
              SwipeDirectionMixin(TouchSwipeMixin(TrackpadSwipeMixin(Explorer)))
            )
          )
        )
      )
    )
  )
) {}

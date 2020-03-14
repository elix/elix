import * as internal from "../base/internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Drawer styles for the Plain reference design system
 *
 * @module PlainDrawerMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function PlainDrawerMixin(Base) {
  return class PlainDrawer extends Base {
    [internal.render](changed) {
      super[internal.render](changed);
      // As the drawer opens (closes), transition the backdrop to fully
      // opaque (transparent).
      if (changed.openedFraction) {
        const {
          drawerTransitionDuration,
          openedFraction,
          openedRenderedFraction,
          showTransition
        } = this[internal.state];

        // The time required to show transitions depends on how far apart the
        // elements currently are from their desired state.
        const transitionFraction = Math.abs(
          openedFraction - openedRenderedFraction
        );
        const duration = showTransition
          ? transitionFraction * (drawerTransitionDuration / 1000)
          : 0;

        Object.assign(this[internal.ids].backdrop.style, {
          opacity: openedFraction,
          transition: showTransition ? `opacity ${duration}s linear` : ""
        });
      }
    }
  };
}

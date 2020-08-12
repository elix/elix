import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  firstRender,
  inputDelegate,
  raiseChangeEvents,
  render,
  rendered,
  setState,
  state,
  stateEffects,
} from "./internal.js";

/**
 * Delegates its ARIA label property to an inner input-type element.
 *
 * This helps ensure that elements built around an inner input element provide a
 * proper accessible label for assistive technologies like screen readers.
 *
 * You can identify which inner input element selection should be delegated to
 * by defining an `internal.inputDelegate` property and returning the desired
 * inner input.
 *
 * @module DelegateInputLabelMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DelegateInputLabelMixin(Base) {
  // The class prototype added by the mixin.
  class DelegateInputLabel extends Base {
    // Forward any ARIA label to the input element.
    get ariaLabel() {
      return this[state].ariaLabel;
    }
    set ariaLabel(ariaLabel) {
      if (!this[state].removingAriaAttribute) {
        this[setState]({ ariaLabel });
      }
    }

    // Forward ARIA labelledby as an aria-label to the input element.
    get ariaLabelledby() {
      return this[state].ariaLabelledby;
    }
    set ariaLabelledby(ariaLabelledby) {
      if (!this[state].removingAriaAttribute) {
        this[setState]({ ariaLabelledby });
      }
    }

    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        ariaLabel: null,
        ariaLabelledby: null,
        inputLabel: null,
        removingAriaAttribute: false,
      });
    }

    [render](changed) {
      super[render](changed);

      if (this[firstRender]) {
        // Refresh the input label on focus. This refresh appears to happen fast
        // enough that the screen reader will announce the refreshed label.
        this.addEventListener("focus", () => {
          this[raiseChangeEvents] = true;
          refreshInputLabel(this);
          this[raiseChangeEvents] = false;
        });
      }

      // Apply the latest input label to the input delegate.
      if (changed.inputLabel) {
        const { inputLabel } = this[state];
        if (inputLabel) {
          this[inputDelegate].setAttribute("aria-label", inputLabel);
        } else {
          this[inputDelegate].removeAttribute("aria-label");
        }
      }
    }

    [rendered](changed) {
      super[rendered](changed);

      // Once we've obtained an aria-label or aria-labelledby from the host, we
      // remove those attirbutes so that the labels don't get announced twice.
      // We use a flag to distinguish between us removing our own ARIA
      // attributes (which should not update state), and someone removing
      // those attributes from the outside (which should update state).
      if (changed.ariaLabel && !this[state].removingAriaAttribute) {
        if (this.getAttribute("aria-label")) {
          this[setState]({ removingAriaAttribute: true });
          this.removeAttribute("aria-label");
        }
      }
      if (changed.ariaLabelledby && !this[state].removingAriaAttribute) {
        if (this.getAttribute("aria-labelledby")) {
          this[setState]({ removingAriaAttribute: true });
          this.removeAttribute("aria-labelledby");
        }
      }

      if (changed.removingAriaAttribute && this[state].removingAriaAttribute) {
        // We've done whatever removal we needed, and can now reset our flag.
        this[setState]({ removingAriaAttribute: false });
      }
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // If the ariaLabel changes, we can update our inputLabel state
      // immediately. Among other things, this facilitates scenarios where we
      // have nested elements using DelegateInputLabelMixin: the outermost
      // element can use whatever label approach it wants, the inner elements
      // will all use ariaLabel.
      if (changed.ariaLabel) {
        Object.assign(effects, { inputLabel: state.ariaLabel });
      }

      return effects;
    }
  }

  return DelegateInputLabel;
}

/**
 * When the element gets the focus, we refresh its label. This is done because
 * three of the labeling strategies (`aria-labelledby` attribute, `for`
 * attribute, and wrapping `label`) reference other elements in the tree -- and
 * the contents of those elements can change dynamically.
 *
 * @private
 * @param {HTMLElement} element
 */
function refreshInputLabel(element) {
  const { ariaLabel, ariaLabelledby } = element[state];

  if (ariaLabel) {
    // Already handled when ariaLabel property was set.
    return;
  }

  const rootNode = element.getRootNode();
  if (!(rootNode instanceof Document || rootNode instanceof DocumentFragment)) {
    // Element isn't attached yet.
    return;
  }

  let inputLabel = null;

  // TODO: Figure out the order in which a browser tries these strategies, and
  // match the browser's order.
  if (ariaLabelledby) {
    // Collect labels from elements with the indicated IDs.
    const ids = ariaLabelledby.split(" ");
    const labels = ids.map((id) => {
      const elementWithId = rootNode.getElementById(id);
      return elementWithId ? elementWithId.textContent : "";
    });
    inputLabel = labels.join(" ");
  } else {
    const id = element.id;
    if (id) {
      // Look for labelling element with `for` attribute.
      const elementWithFor = rootNode.querySelector(`[for="${id}"]`);
      if (elementWithFor instanceof HTMLElement) {
        // Obtain label from wrapping label element.
        inputLabel = elementWithFor.innerText;
        elementWithFor.setAttribute("aria-hidden", "true");
      }
    }
    if (inputLabel === null) {
      // Last option is to look for closest wrapping label element.
      const labelElement = element.closest("label");
      if (labelElement) {
        inputLabel = labelElement.innerText;
        labelElement.setAttribute("aria-hidden", "true");
      }
    }
  }

  if (inputLabel) {
    inputLabel = inputLabel.trim();
  }

  element[setState]({ inputLabel });
}

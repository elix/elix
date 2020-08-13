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
          const inputLabel = refreshInputLabel(this, this[state]);
          this[setState]({ inputLabel });
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
      //
      // We also update the label if the value changes. One pattern with
      // select-like elements is to have them include their own ID in the IDs
      // specified by aria-labelledby. This incorporates the element's own
      // `value` in the announced label. Since that `value` can change while the
      // element has focus, we refresh the label if the value changes.
      if (changed.ariaLabel || changed.value) {
        const inputLabel = refreshInputLabel(this, state);
        Object.assign(effects, { inputLabel });
      }

      return effects;
    }
  }

  return DelegateInputLabel;
}

function getLabelFromElement(element) {
  return element.value || element.innerText;
}

/**
 * Calculate an appropriate label for the component's delegated input element.
 * When the element gets the focus, we refresh its label. This is done because
 * three of the labeling strategies (`aria-labelledby` attribute, `for`
 * attribute, and wrapping `label`) reference other elements in the tree -- and
 * the contents of those elements can change dynamically.
 *
 * @private
 * @param {HTMLElement} element
 * @param {PlainObject} state
 */
function refreshInputLabel(element, state) {
  const { ariaLabel, ariaLabelledby } = state;

  const rootNode = element.getRootNode();
  let inputLabel = null;

  if (ariaLabel) {
    // Use ariaLabel property as input label.
    inputLabel = ariaLabel;
  } else if (
    !(rootNode instanceof Document || rootNode instanceof DocumentFragment)
  ) {
    // Element isn't attached yet, label is null.
  } else if (ariaLabelledby) {
    // TODO: Figure out the order in which a browser tries these strategies, and
    // match the browser's order.
    // Collect labels from elements with the indicated IDs.
    const ids = ariaLabelledby.split(" ");
    const labels = ids.map((id) => {
      const elementWithId = rootNode.getElementById(id);
      // Get a label from the indicated element.
      // Special case: if the element is providing its own label, we return its
      // current `value` state instead of using the public `value` property.
      const label = !elementWithId
        ? ""
        : elementWithId === element && state.value !== null
        ? state.value
        : getLabelFromElement(elementWithId);
      return label;
    });
    inputLabel = labels.join(" ");
  } else {
    const id = element.id;
    if (id) {
      // Look for labelling element with `for` attribute.
      const elementWithFor = rootNode.querySelector(`[for="${id}"]`);
      if (elementWithFor instanceof HTMLElement) {
        // Obtain label from wrapping label element.
        inputLabel = getLabelFromElement(elementWithFor);
        // elementWithFor.setAttribute("aria-hidden", "true");
      }
    }
    if (inputLabel === null) {
      // Last option is to look for closest wrapping label element.
      const labelElement = element.closest("label");
      if (labelElement) {
        inputLabel = getLabelFromElement(labelElement);
        // labelElement.setAttribute("aria-hidden", "true");
      }
    }
  }

  if (inputLabel) {
    inputLabel = inputLabel.trim();
  }

  return inputLabel;
}

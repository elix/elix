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
        this[setState]({
          ariaLabel: String(ariaLabel),
        });
      }
    }

    // Forward ARIA labelledby as an aria-label to the input element.
    // Note the lowercase "b" in the name, necessary to support the actual
    // attribute name "aria-labelledby", which has no hyphen before the "by".
    get ariaLabelledby() {
      return this[state].ariaLabelledby;
    }
    set ariaLabelledby(ariaLabelledby) {
      if (!this[state].removingAriaAttribute) {
        this[setState]({
          ariaLabelledby: String(ariaLabelledby),
        });
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
      if (super[render]) {
        super[render](changed);
      }

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
      if (super[rendered]) {
        super[rendered](changed);
      }

      if (this[firstRender]) {
        // Refresh the label on first render. This is not guaranteed to pick up
        // labels defined by another element, as that element (or elements) may
        // not be in the DOM yet. For that reason, we'll also refresh the label
        // on focus. The reason to do it now is to handle the common cases where
        // the element defining the label does exist so that accessibility
        // testing tools can confirm that the input delegate does have a label.
        // Because this refresh can entail multiple searches of the tree, we
        // defer the refresh to idle time.
        const idleCallback = window.requestIdleCallback || setTimeout;
        idleCallback(() => {
          const inputLabel = refreshInputLabel(this, this[state]);
          this[setState]({ inputLabel });
        });
      }

      // Once we've obtained an aria-label or aria-labelledby from the host, we
      // remove those attirbutes so that the labels don't get announced twice.
      // We use a flag to distinguish between us removing our own ARIA
      // attributes (which should not update state), and someone removing
      // those attributes from the outside (which should update state).
      const { ariaLabel, ariaLabelledby } = this[state];
      if (changed.ariaLabel && !this[state].removingAriaAttribute) {
        if (this.getAttribute("aria-label")) {
          this.setAttribute("delegated-label", ariaLabel);
          this[setState]({ removingAriaAttribute: true });
          this.removeAttribute("aria-label");
        }
      }
      if (changed.ariaLabelledby && !this[state].removingAriaAttribute) {
        if (this.getAttribute("aria-labelledby")) {
          this.setAttribute("delegated-labelledby", ariaLabelledby);
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
      // We also update the label if we're focused, using ariaLabelledby, and
      // the selectedText changes. One pattern with select-like elements is to
      // have them include their own ID in the IDs specified by aria-labelledby.
      // This can incorporate the element's own `selectedText` in the announced
      // label. That `selectedText` can change while the element has focus, in
      // which case we'll refresh.
      if (
        (changed.ariaLabel && state.ariaLabel) ||
        (changed.selectedText &&
          state.ariaLabelledby &&
          this.matches(":focus-within"))
      ) {
        const inputLabel = refreshInputLabel(this, state);
        Object.assign(effects, { inputLabel });
      }

      return effects;
    }
  }

  return DelegateInputLabel;
}

// Given an element that is being used as a label, extract its label text.
function getLabelFromElement(element) {
  // We use innerText here instead of textContent because we want the rendered
  // text. If, e.g., a text node includes a span with `display: none`,
  // textContent would include that hidden text, but innerText would leave it
  // out -- which is what we want here.
  if ("selectedText" in element) {
    // Element (most likely Elix) with selectedText property
    return element.selectedText;
  } else if ("value" in element && "options" in element) {
    // select or select-like element
    const value = element.value;
    const option = element.options.find((option) => option.value === value);
    return option ? option.innerText : "";
  } else if ("value" in element) {
    // Other input element
    return element.value;
  } else {
    // Other
    return element.innerText;
  }
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
  /** @type {any} */ const rootNode = element.isConnected
    ? element.getRootNode()
    : null;
  let inputLabel = null;

  // Prefer aria-labelledby over aria-label, per
  // https://developers.google.com/web/fundamentals/accessibility/semantics-aria/aria-labels-and-relationships.
  // After that, we prefer a `label` element with a `for` attribute, and finally
  // a wrapping `label` element.
  //
  // There do not appear to be consistent cross-browser rules for handling
  // multiple forms of label assignment on the same component. E.g., if you
  // place an element in a wrapping label *and* point a `label` element at that
  // element with a `for` attribute, as of August 2020 Chrome and Firefox will
  // announce both, but Safari will only announce the `for` label.
  //
  // Since people are probably not relying upon specific results for multiple
  // forms of label assignment, we don't attempt to construct a combined label
  // in those cases.
  if (ariaLabelledby && rootNode) {
    // Collect labels from elements with the indicated IDs.
    const ids = ariaLabelledby.split(" ");
    const labels = ids.map((id) => {
      const elementWithId = rootNode.getElementById(id);
      // Get a label from the indicated element.
      // Special case: if the element is providing its own label, we return its
      // current `selectedText` state.
      const label = !elementWithId
        ? ""
        : elementWithId === element && state.value !== null
        ? state.selectedText
        : getLabelFromElement(elementWithId);
      return label;
    });
    inputLabel = labels.join(" ");
  } else if (ariaLabel) {
    // Use ariaLabel property as input label.
    inputLabel = ariaLabel;
  } else if (rootNode) {
    const id = element.id;
    if (id) {
      // Look for labelling element with `for` attribute.
      const elementWithFor = rootNode.querySelector(`[for="${id}"]`);
      if (elementWithFor instanceof HTMLElement) {
        // Obtain label from wrapping label element.
        inputLabel = getLabelFromElement(elementWithFor);
      }
    }
    if (inputLabel === null) {
      // Last option is to look for closest wrapping label element.
      const labelElement = element.closest("label");
      if (labelElement) {
        inputLabel = getLabelFromElement(labelElement);
      }
    }
  }

  if (inputLabel) {
    inputLabel = inputLabel.trim();
  }

  return inputLabel;
}

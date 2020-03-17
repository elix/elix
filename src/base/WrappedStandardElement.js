import { setInternalState, standardBooleanAttributes } from "../core/dom.js";
import * as internal from "./internal.js";
import * as template from "../core/template.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";

const extendsKey = Symbol("extends");

/* True if a standard element is focusable by default. */
/** @type {IndexedObject<boolean>} */
const focusableByDefault = {
  a: true,
  area: true,
  button: true,
  details: true,
  iframe: true,
  input: true,
  select: true,
  textarea: true
};

/*
 * A set of events which, if fired by the inner standard element, should be
 * re-raised by the custom element.
 *
 * These are events which are spec'ed to NOT get retargetted across a Shadow DOM
 * boundary, organized by which element(s) raise the events. To properly
 * simulate these, we will need to listen for the real events, then re-raise a
 * simulation of the original event. For more information, see
 * https://www.w3.org/TR/shadow-dom/#h-events-that-are-not-leaked-into-ancestor-trees.
 *
 * It appears that we do *not* need to re-raise the non-bubbling "focus" and
 * "blur" events. These appear to be automatically re-raised as expected -- but
 * it's not clear why that happens.
 *
 * The list below is reasonably complete. It omits elements that cannot be
 * wrapped (see class notes above). Also, we haven't actually tried wrapping
 * every element in this list; some of the more obscure ones might not actually
 * work as expected, but it was easier to include them for completeness than
 * to actually verify whether or not the element can be wrapped.
 */
/** @type {IndexedObject<string[]>} */
const reraiseEvents = {
  address: ["scroll"],
  blockquote: ["scroll"],
  caption: ["scroll"],
  center: ["scroll"],
  dd: ["scroll"],
  dir: ["scroll"],
  div: ["scroll"],
  dl: ["scroll"],
  dt: ["scroll"],
  fieldset: ["scroll"],
  form: ["reset", "scroll"],
  frame: ["load"],
  h1: ["scroll"],
  h2: ["scroll"],
  h3: ["scroll"],
  h4: ["scroll"],
  h5: ["scroll"],
  h6: ["scroll"],
  iframe: ["load"],
  img: ["abort", "error", "load"],
  input: ["abort", "change", "error", "select", "load"],
  li: ["scroll"],
  link: ["load"],
  menu: ["scroll"],
  object: ["error", "scroll"],
  ol: ["scroll"],
  p: ["scroll"],
  script: ["error", "load"],
  select: ["change", "scroll"],
  tbody: ["scroll"],
  tfoot: ["scroll"],
  thead: ["scroll"],
  textarea: ["change", "select", "scroll"]
};

/*
 * Mouse events that should be disabled if the inner component is disabled.
 */
const mouseEventNames = [
  "click",
  "dblclick",
  "mousedown",
  "mouseenter",
  "mouseleave",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "wheel"
];

// Keep track of which re-raised events should bubble.
/** @type {IndexedObject<boolean>} */
const eventBubbles = {
  abort: true,
  change: true,
  reset: true
};

// Elements which are display: block by default.
// Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements
const blockElements = [
  "address",
  "article",
  "aside",
  "blockquote",
  "canvas",
  "dd",
  "div",
  "dl",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "hr",
  "li",
  "main",
  "nav",
  "noscript",
  "ol",
  "output",
  "p",
  "pre",
  "section",
  "table",
  "tfoot",
  "ul",
  "video"
];

// Standard attributes that don't have corresponding properties.
// These need to be delegated from the wrapper to the inner element.
const attributesWithoutProperties = [
  "accept-charset",
  "autoplay",
  "buffered",
  "challenge",
  "codebase",
  "colspan",
  "contenteditable",
  "controls",
  "crossorigin",
  "datetime",
  "dirname",
  "for",
  "formaction",
  "http-equiv",
  "icon",
  "ismap",
  "itemprop",
  "keytype",
  "language",
  "loop",
  "manifest",
  "maxlength",
  "minlength",
  "muted",
  "novalidate",
  "preload",
  "radiogroup",
  "readonly",
  "referrerpolicy",
  "rowspan",
  "scoped",
  "usemap"
];

const Base = DelegateFocusMixin(ReactiveElement);

/**
 * Wraps a standard HTML element so it can be extended
 *
 * The typical way to use this class is via its static `wrap` method.
 *
 * @inherits ReactiveElement
 * @mixes DelegateFocusMixin
 * @part inner - the inner standard HTML element
 */
class WrappedStandardElement extends Base {
  constructor() {
    super();
    /** @type {any} */ const cast = this;
    if (!this[internal.nativeInternals] && cast.attachInternals) {
      this[internal.nativeInternals] = cast.attachInternals();
    }
  }

  /**
   *
   * Wrapped standard elements need to forward some attributes to the inner
   * element in cases where the attribute does not have a corresponding
   * property. These attributes include those prefixed with "aria-", and some
   * unusual standard attributes like contenteditable. To handle those, this
   * class defines its own attributeChangedCallback.
   *
   * @ignore
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    const forwardAttribute = attributesWithoutProperties.indexOf(name) >= 0;
    if (forwardAttribute) {
      const innerAttributes = Object.assign(
        {},
        this[internal.state].innerAttributes,
        {
          [name]: newValue
        }
      );
      this[internal.setState]({ innerAttributes });
    } else {
      // Rely on the base attributeChangedCallback provided by
      // AttributeMarshallingMixin.
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  // Delegate method defined by HTMLElement.
  blur() {
    this.inner.blur();
  }

  // One HTMLElement we *don't* delegate is `click`. Generally speaking, a click
  // on the outer wrapper should behave the same as a click on the inner
  // element. Also, we want to ensure outside event listeners get a click event
  // when the click method is invoked. But a click on the inner element will
  // raise a click event that won't be re-raised by default across the shadow
  // boundary. The precise behavior seems to be slightly different in Safari
  // than other browsers, but it seems safer to not delegate click.
  //
  // click() {}

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      innerAttributes: {},
      innerProperties: {}
    });
  }

  get [internal.defaultTabIndex]() {
    return focusableByDefault[this.extends] ? 0 : -1;
  }

  /**
   * The tag name of the standard HTML element extended by this class.
   *
   * @returns {string}
   */
  get extends() {
    return this.constructor[extendsKey];
  }

  /**
   * Returns a reference to the inner standard HTML element!
   *
   * @type {HTMLElement}
   */
  get inner() {
    /** @type {any} */
    const result = this[internal.ids] && this[internal.ids].inner;
    if (!result) {
      /* eslint-disable no-console */
      console.warn(
        "Attempted to get an inner standard element before it was instantiated."
      );
    }
    return result;
  }

  /**
   * Return the value of the named property on the inner standard element.
   *
   * @param {string} name
   * @returns {any}
   */
  getInnerProperty(name) {
    // If we haven't rendered yet, use internal state value. Once we've
    // rendered, we get the value from the wrapped element itself. Return our
    // concept of the current property value from state. If the property hasn't
    // been defined, however, get the current value of the property from the
    // inner element.
    //
    // This is intended to support cases like an anchor element. If someone sets
    // `href` on a wrapped anchor, we'll know the value of `href` from state,
    // but we won't know the value of href-dependent calculated properties like
    // `protocol`. Using two sources of truth (state and the inner element)
    // seems fragile, but it's unclear how else to handle this without
    // reimplementing all HTML property interactions ourselves.
    //
    // This arrangement also means that, if an inner element property can change
    // in response to user interaction (e.g., an input element's value changes
    // as the user types), the component must listen to suitable events on the
    // inner element and update its state accordingly.
    const value = this[internal.state].innerProperties[name];
    return value || (this[internal.shadowRoot] && this.inner[name]);
  }

  static get observedAttributes() {
    // For our custom attributeChangedCallback to work, we need to observe
    // the attributes we want to forward.
    // @ts-ignore
    return [...super.observedAttributes, ...attributesWithoutProperties];
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);

    const inner = this.inner;
    if (this[internal.firstRender]) {
      // Listen for any events raised by the inner element which will not
      // automatically be retargetted across the Shadow DOM boundary, and
      // re-raise those events when they happen.
      const eventNames = reraiseEvents[this.extends] || [];
      eventNames.forEach(eventName => {
        inner.addEventListener(eventName, () => {
          const event = new Event(eventName, {
            bubbles: eventBubbles[eventName] || false
          });
          this.dispatchEvent(event);
        });
      });

      // If inner element can be disabled, then listen to mouse events on the
      // *outer* element and absorb them if the inner element is disabled.
      // Without this, a mouse event like a click on the inner disabled element
      // would be treated as a click on the outer element. Someone listening to
      // clicks on the outer element would get a click event, even though the
      // overall element is supposed to be disabled.
      if ("disabled" in inner) {
        mouseEventNames.forEach(eventName => {
          this.addEventListener(eventName, event => {
            if (/** @type {any} */ (inner).disabled) {
              event.stopImmediatePropagation();
            }
          });
        });
      }
    }

    if (changed.tabIndex) {
      inner.tabIndex = this[internal.state].tabIndex;
    }

    if (changed.innerAttributes) {
      // Forward attributes to the inner element.
      // See notes at attributeChangedCallback.
      const { innerAttributes } = this[internal.state];
      for (const name in innerAttributes) {
        applyAttribute(inner, name, innerAttributes[name]);
      }
    }

    if (changed.innerProperties) {
      // Forward properties to the inner element.
      const { innerProperties } = this[internal.state];
      Object.assign(inner, innerProperties);
    }
  }

  [internal.rendered](/** @type {ChangedFlags} */ changed) {
    super[internal.rendered](changed);
    if (changed.innerProperties) {
      const { innerProperties } = this[internal.state];
      const { disabled } = innerProperties;
      if (disabled !== undefined) {
        setInternalState(this, "disabled", disabled);
      }
    }
  }

  /**
   * Set the named property on the inner standard element.
   *
   * @param {string} name
   * @param {any} value
   */
  setInnerProperty(name, value) {
    // We normally don't check an existing state value before calling[internal.setState],
    // relying instead on[internal.setState] to do that check for us. However, we have
    // dangers in this particular component of creating infinite loops.
    //
    // E.g., setting the tabindex attibute will call attributeChangedCallback,
    // which will set the tabIndex property, which will want to set state, which
    // will cause a render, which will try to reflect the current value of the
    // tabIndex property to the tabindex attribute, causing a loop.
    //
    // To avoid this, we check the existing value before updating our state.
    const current = this[internal.state].innerProperties[name];
    if (current !== value) {
      const innerProperties = Object.assign(
        {},
        this[internal.state].innerProperties,
        {
          [name]: value
        }
      );
      this[internal.setState]({ innerProperties });
    }
  }

  /**
   * The template copied into the shadow tree of new instances of this element.
   *
   * The default value of this property is a template that includes an instance
   * the standard element being wrapped, with a `<slot>` element inside that
   * to pick up the element's light DOM content. For example, if you wrap an
   * `<a>` element, then the default template will look like:
   *
   *     <template>
   *       <style>
   *       :host {
   *         display: inline-block;
   *       }
   *       </style>
   *       <a id="inner">
   *         <slot></slot>
   *       </a>
   *     </template>
   *
   * The `display` styling applied to the host will be `block` for elements that
   * are block elements by default, and `inline-block` (not `inline`) for other
   * elements.
   *
   * If you'd like the template to include other elements, then override this
   * property and return a template of your own. The template should include an
   * instance of the standard HTML element you are wrapping, and the ID of that
   * element should be "inner".
   *
   * @type {(string|HTMLTemplateElement)}
   */
  get [internal.template]() {
    const display = blockElements.includes(this.extends)
      ? "block"
      : "inline-block";
    return template.html`
      <style>
        :host {
          display: ${display}
        }
        
        [part~="inner"] {
          box-sizing: border-box;
          height: 100%;
          width: 100%;
        }
      </style>
      <${this.extends} id="inner" part="inner">
        <slot></slot>
      </${this.extends}>
    `;
  }

  /**
   * Creates a class that wraps a standard HTML element.
   *
   * Note that the resulting class is a subclass of WrappedStandardElement, not
   * the standard class being wrapped. E.g., if you call
   * `WrappedStandardElement.wrap('a')`, you will get a class whose shadow tree
   * will include an anchor element, but the class will *not* inherit from
   * HTMLAnchorElement.
   *
   * @static
   * @param {string} extendsTag - the standard HTML element tag to extend
   */
  static wrap(extendsTag) {
    // Create the new class.
    /** @type {Constructor<WrappedStandardElement>} */
    class Wrapped extends WrappedStandardElement {}

    // Indicate which tag it wraps.
    /** @type {any} */ (Wrapped)[extendsKey] = extendsTag;

    // Create getter/setters that delegate to the wrapped element.
    const element = document.createElement(extendsTag);
    defineDelegates(Wrapped, Object.getPrototypeOf(element));

    return Wrapped;
  }
}

/**
 * Update the given attribute on an element.
 *
 * Passing a non-null `value` acts like a call to `setAttribute(name, value)`.
 * If the supplied `value` is nullish, this acts like a call to
 * `removeAttribute(name)`.
 *
 * @private
 * @param {HTMLElement} element
 * @param {string} name
 * @param {string} value
 */
export function applyAttribute(element, name, value) {
  if (standardBooleanAttributes[name]) {
    // Boolean attribute
    if (typeof value === "string") {
      element.setAttribute(name, "");
    } else if (value === null) {
      element.removeAttribute(name);
    }
  } else {
    // Regular string-valued attribute
    if (value != null) {
      element.setAttribute(name, value.toString());
    } else {
      element.removeAttribute(name);
    }
  }
}

/**
 * Create a delegate for the method or property identified by the descriptor.
 *
 * @private
 * @param {string} name
 * @param {PropertyDescriptor} descriptor
 */
function createDelegate(name, descriptor) {
  if (typeof descriptor.value === "function") {
    if (name !== "constructor") {
      return createMethodDelegate(name, descriptor);
    }
  } else if (
    typeof descriptor.get === "function" ||
    typeof descriptor.set === "function"
  ) {
    return createPropertyDelegate(name, descriptor);
  }
  return null;
}

/**
 * Create a delegate for the method identified by the descriptor.
 *
 * @private
 * @param {string} name
 * @param {PropertyDescriptor} descriptor
 */
function createMethodDelegate(name, descriptor) {
  const value = function(/** @type {any[]} */ ...args) {
    // @ts-ignore
    this.inner[name](...args);
  };
  const delegate = {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    value,
    writable: descriptor.writable
  };
  return delegate;
}

/**
 * Create a delegate for the property identified by the descriptor.
 *
 * @private
 * @param {string} name
 * @param {PropertyDescriptor} descriptor
 */
function createPropertyDelegate(name, descriptor) {
  /** @type {PlainObject} */
  const delegate = {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable
  };
  if (descriptor.get) {
    delegate.get = function() {
      return this.getInnerProperty(name);
    };
  }
  if (descriptor.set) {
    delegate.set = function(/** @type {any} */ value) {
      this.setInnerProperty(name, value);
    };
  }
  if (descriptor.writable) {
    delegate.writable = descriptor.writable;
  }
  return delegate;
}

/**
 * Define delegates for the given class for each property/method on the
 * indicated prototype.
 *
 * @private
 * @param {Constructor<Object>} cls
 * @param {Object} prototype
 */
function defineDelegates(cls, prototype) {
  const names = Object.getOwnPropertyNames(prototype);
  names.forEach(name => {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
    if (!descriptor) {
      return;
    }
    const delegate = createDelegate(name, descriptor);
    if (delegate) {
      Object.defineProperty(cls.prototype, name, delegate);
    }
  });
}

export default WrappedStandardElement;

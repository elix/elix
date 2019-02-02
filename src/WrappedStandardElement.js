import { merge, booleanAttributes } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import DelegateFocusMixin from './DelegateFocusMixin.js';
import ReactiveElement from './ReactiveElement.js';


const extendsKey = Symbol('extends');
const renderedKey = Symbol('rendered');


/*
 * A set of events which, if fired by the inner standard element, should be
 * re-raised by the custom element. (We only need to do that under native
 * Shadow DOM, not the polyfill.)
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
const reraiseEvents = {
  address: ['scroll'],
  blockquote: ['scroll'],
  caption: ['scroll'],
  center: ['scroll'],
  dd: ['scroll'],
  dir: ['scroll'],
  div: ['scroll'],
  dl: ['scroll'],
  dt: ['scroll'],
  fieldset: ['scroll'],
  form: ['reset', 'scroll'],
  frame: ['load'],
  h1: ['scroll'],
  h2: ['scroll'],
  h3: ['scroll'],
  h4: ['scroll'],
  h5: ['scroll'],
  h6: ['scroll'],
  iframe: ['load'],
  img: ['abort', 'error', 'load'],
  input: ['abort', 'change', 'error', 'select', 'load'],
  keygen: ['reset', 'select'],
  li: ['scroll'],
  link: ['load'],
  menu: ['scroll'],
  object: ['error', 'scroll'],
  ol: ['scroll'],
  p: ['scroll'],
  script: ['error', 'load'],
  select: ['change', 'scroll'],
  tbody: ['scroll'],
  tfoot: ['scroll'],
  thead: ['scroll'],
  textarea: ['change', 'select', 'scroll']
};


/*
 * Mouse events that should be disabled if the inner component is disabled.
 */
const mouseEventNames = [
  'click',
  'dblclick',
  'mousedown',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'wheel'
];


// Keep track of which re-raised events should bubble.
const eventBubbles = {
  abort: true,
  change: true,
  reset: true
};


// Elements which are display: block by default.
// Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements
const blockElements = [
  'address',
  'article',
  'aside',
  'blockquote',
  'canvas',
  'dd',
  'div',
  'dl',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hgroup',
  'hr',
  'li',
  'main',
  'nav',
  'noscript',
  'ol',
  'output',
  'p',
  'pre',
  'section',
  'table',
  'tfoot',
  'ul',
  'video'
];


const Base =
  DelegateFocusMixin(
    ReactiveElement
  );


/**
 * Wraps a standard HTML element so it can be extended
 * 
 * The typical way to use this class is via its static `wrap` method.
 * 
 * @inherits ReactiveElement
 */
class WrappedStandardElement extends Base {

  // Delegate generally-useful ARIA attributes to inner element. These property
  // definitions let AttributeMarshallingMixin know it should observe these
  // attributes.
  get ariaDescribedby() {
    return this.getInnerAttribute('aria-describedby');
  }
  set ariaDescribedby(value) {
    this.setInnerAttribute('aria-describedby', value);
  }
  get ariaLabel() {
    return this.getInnerAttribute('aria-label');
  }
  set ariaLabel(value) {
    this.setInnerAttribute('aria-label', value);
  }
  get ariaLabelledby() {
    return this.getInnerAttribute('aria-label');
  }
  set ariaLabelledby(value) {
    this.setInnerAttribute('aria-label', value);
  }

  // Delegate method defined by HTMLElement.
  blur() {
    /** @type {any} */
    const cast = this.inner;
    cast.blur();
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

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }

    // Listen for any events raised by the inner element which will not
    // automatically be retargetted across the Shadow DOM boundary, and re-raise
    // those events when they happen.
    //
    // Note: It's unclear why we need to do this in the Shadow DOM polyfill.
    // In theory, events in the light DOM should bubble as normal. But this
    // code appears to be required in the polyfill case as well.
    const eventNames = reraiseEvents[this.extends] || [];
    eventNames.forEach(eventName => {
      this.inner.addEventListener(eventName, () => {
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
    if ('disabled' in this.$.inner) {
      mouseEventNames.forEach(eventName => {
        this.addEventListener(eventName, event => {
          /** @type {any} */
          const element = this.$.inner;
          if (element.disabled) {
            event.stopImmediatePropagation();
          }
        });
      });
    }

    this[renderedKey] = true;
    reflectDisabledAttribute(this);
  }

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
    const disabled = this.state.innerProperties && this.state.innerProperties.disabled;
    const previousDisabled = previousState.innerProperties && previousState.innerProperties.disabled;
    const disabledChanged = disabled !== previousDisabled;
    if (disabledChanged) {
      reflectDisabledAttribute(this);
    }
  }

  get defaultState() {
    return Object.assign(super.defaultState, {
      innerAttributes: null,
      innerProperties: null
    });
  }

  get extends() {
    return this.constructor[extendsKey];
  }
  
  /**
   * Returns a reference to the inner standard HTML element.
   *
   * @type {Element}
   */
  get inner() {
    const result = this.$ && this.$.inner;
    if (!result) {
      /* eslint-disable no-console */
      console.warn('Attempted to get an inner standard element before it was instantiated.');
    }
    return result;
  }
  
  getInnerAttribute(name) {
    // If we haven't rendered yet, use internal state value.
    return this.shadowRoot ?
      this.inner[name] :
      this.state.innerAttributes[name];
  }
  
  getInnerProperty(name) {
    // If we haven't rendered yet, use internal state value.
    return this.shadowRoot ?
      this.inner[name] :
      this.state.innerProperties[name];
  }

  setInnerAttribute(name, value) {
    if (this.shadowRoot) {
      // We've been rendered, so set property directly on inner element.
      if (!name.includes('-')) {
        // Set directly as property; works better for native attributes.
        this.inner[name] = value;
      } else {
        // Set as attribute, fallback for things like ARIA attributes.
        this.inner.setAttribute(name, value);
      }
    }
  
    // Save attribute in state.
    // This lets us save attributes set before the component is rendered,
    // as well as letting us know whether we need to re-render in response
    // to an attribute change.
    const innerAttributes = Object.assign({}, this.state.innerAttributes, {
      [name]: value
    });
    this.setState({ innerAttributes });
  }

  setInnerProperty(name, value) {
    // Special case for boolean attributes, which may be passed as strings via
    // calls to setAttribute.
    const cast = castPotentialBooleanAttribute(name, value);
    
    if (this.shadowRoot) {
      // We've been rendered, so set property directly on inner element.
      this.inner[name] = cast;
    }

    // Save property assignment in state.
    // See setInnerAttribute for reasoning.
    const innerProperties = Object.assign({}, this.state.innerProperties, {
      [name]: cast
    });
    this.setState({ innerProperties });
  }

  shouldComponentUpdate(nextState) {
    const base = super.shouldComponentUpdate && super.shouldComponentUpdate(nextState);
    if (base) {
      return true; // Trust base result.
    }

    // Do a shallow prop comparison of inner properties and attributes too.
    for (const key in nextState.innerAttributes) {
      if (nextState.innerAttributes[key] !== this.state.innerAttributes[key]) {
        return true;
      }
    }

    for (const key in nextState.innerProperties) {
      if (nextState.innerProperties[key] !== this.state.innerProperties[key]) {
        return true;
      }
    }

    return false; // No changes.
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
  get [symbols.template]() {
    const display = blockElements.indexOf(this.extends) >= 0 ?
      'block' :
      'inline-block';
    return template.html`<style>:host { display: ${display}} #inner { box-sizing: border-box; height: 100%; width: 100%; }</style><${this.extends} id="inner"><slot></slot></${this.extends}`;
  }

  get updates() {
    // Only apply updates the first time. Thereafter, we apply
    // property/attribute updates directly to inner element, so such updates
    // aren't necessary.
    const updates = this[renderedKey] ?
      null :
      {
        $: {
          inner: Object.assign(
            {},
            this.state.innerAttributes && {
              attributes: this.state.innerAttributes
            },
            this.state.innerProperties
          )
        }
      };
    return merge(super.updates, updates);
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
    class Wrapped extends WrappedStandardElement {}
    
    // Indicate which tag it wraps.
    Wrapped[extendsKey] = extendsTag;

    // Create getter/setters that delegate to the wrapped element.
    const element = document.createElement(extendsTag);
    defineDelegates(Wrapped, Object.getPrototypeOf(element));

    return Wrapped;
  }

}


// If the given attribute name corresponds to a boolean attribute,
// map the supplied string value to a boolean. Otherwise return as is.
function castPotentialBooleanAttribute(attributeName, value) {
  if (booleanAttributes[attributeName]) {
    if (typeof value === 'string') {
      return true;
    } else if (value === null) {
      return false;
    }
  }
  return value;
}


function createDelegate(name, descriptor) {
  if (typeof descriptor.value === 'function') {
    if (name !== 'constructor') {
      return createMethodDelegate(name, descriptor);
    }
  } else if (typeof descriptor.get === 'function' ||
    typeof descriptor.set === 'function') {
    return createPropertyDelegate(name, descriptor);
  }
  return null;
}


function createMethodDelegate(name, descriptor) {
  const value = function(...args) {
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


function createPropertyDelegate(name, descriptor) {
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
    delegate.set = function(value) {
      this.setInnerProperty(name, value);
    };
  }
  if (descriptor.writable) {
    delegate.writable = descriptor.writable;
  }
  return delegate;
}


// Define delegates for the given class for each property/method on the
// indicated prototype.
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


// Reflect value of disabled property to the corresponding attribute.
function reflectDisabledAttribute(element) {
  element.toggleAttribute('disabled', element.disabled);
}


export default WrappedStandardElement;

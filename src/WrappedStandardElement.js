import { html } from './templates.js';
import { merge, booleanAttributes } from './updates.js';
import * as symbols from './symbols.js';
import ReactiveElement from './ReactiveElement.js';


const extendsKey = Symbol('extends');


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


/**
 * Wraps a standard HTML element so that the standard behavior can then be
 * extended. The typical way to use this class is via its static `wrap`
 * method.
 * 
 * @inherits ReactiveElement
 */
class WrappedStandardElement extends ReactiveElement {

  // Define an ariaLabel property and delegate it to the inner element. This
  // definition lets AttributeMarshallingMixin know it should handle this
  // aria-label attribute.
  get ariaLabel() {
    return this.getAttribute('aria-label');
  }
  set ariaLabel(label) {
    // Propagate the ARIA label to the inner textarea.
    this.setInnerAttribute('aria-label', label);
  }

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
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      innerAttributes: {}
    });
  }

  get extends() {
    return this.constructor[extendsKey];
  }
  
  /**
   * Returns a reference to the inner standard HTML element.
   *
   * @type {HTMLElement}
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
    // Prefer internal state value, which may not have rendered yet.
    const value = this.state.innerAttributes[name];
    return value !== undefined ? value : this.inner[name];
  }

  setInnerAttribute(name, value) {
    // Special case for boolean attributes, which may be passed as strings via
    // calls to setAttribute.
    const cast = castPotentialBooleanAttribute(name, value);
    const innerAttributes = Object.assign({}, this.state.innerAttributes, {
      [name]: cast
    });
    this.setState({ innerAttributes });
  }

  shouldComponentUpdate(nextState) {
    const base = super.shouldComponentUpdate && super.shouldComponentUpdate(nextState);
    if (base) {
      return true; // Trust base result.
    }
    // Do a shallow prop comparison of inner properties too.
    for (const key in nextState.inner) {
      if (nextState[key] !== this.state.innerAttributes[key]) {
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
    return html`<style>:host { display: ${display}}</style><${this.extends} id="inner"><slot></slot></${this.extends}`;
  }

  get updates() {
    return merge(super.updates, {
      $: {
        inner: {
          attributes: this.state.innerAttributes
        }
      }
    });
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
    const extendsPrototype = element.constructor.prototype;
    const names = Object.getOwnPropertyNames(extendsPrototype);
    names.forEach(name => {
      const descriptor = Object.getOwnPropertyDescriptor(extendsPrototype, name);
      const delegate = createPropertyDelegate(name, descriptor);
      Object.defineProperty(Wrapped.prototype, name, delegate);
    });

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


function createPropertyDelegate(name, descriptor) {
  const delegate = {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
  };
  if (descriptor.get) {
    delegate.get = function() {
      return this.getInnerAttribute(name); 
    };
  }
  if (descriptor.set) {
    delegate.set = function (value) {
      this.setInnerAttribute(name, value);
    };
  }
  if (descriptor.writable) {
    delegate.writable = descriptor.writable;
  }
  return delegate;
}


export default WrappedStandardElement;

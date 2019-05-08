import * as symbols from './symbols.js';


/**
 * Track an element's original class list, style, and other attributes.
 * 
 * @module OriginalAttributesMixin
 */
export default function OriginalAttributesMixin(Base) {
  return class OriginalAttributes extends Base {

    connectedCallback() {
      // Calculate original props before we call super. If, e.g., ReactiveMixin
      // is applied before this mixin, we want to get the original props before
      // we render.
      /** @type {any} */ const element = this;
      const original = current(element);
      this.setState({
        original
      });

      if (super.connectedCallback) { super.connectedCallback(); }
    }

    // See setAttribute
    removeAttribute(name) {
      super.removeAttribute(name);
      if (!this[symbols.rendering] &&
          this.state.original.attributes[name] != null) {
        updateOriginalProp(this, name, null);
      }
    }

    // Override setAttribute so that, if this is called outside of rendering,
    // we can update our notion of the component's original updates.
    setAttribute(name, value) {
      if (!this[symbols.rendering]) {
        updateOriginalProp(this, name, value);
      }
      super.setAttribute(name, value);
    }

    // Override style for same reasons as setAttribute.
    get style() {
      return super.style;
    }
    set style(style) {
      if (!this[symbols.rendering]) {
        updateOriginalProp(this, 'style', style);
      }
      super.style = style;
    }
  }
}


/**
 * Returns a dictionary of the current attributes, classes, and styles of the
 * indicated element.
 * 
 * The returned dictionary is in the same format as that supported by
 * [apply](#apply).
 * 
 * @param {Element} element - the element to examine
 * @returns {object} a dictionary of the current attributes, classes, and styles
 */
function current(element) {
  return element instanceof HTMLElement ?
    {
      attributes: currentAttributes(element),
      classes: currentClasses(element),
      style: currentStyles(element)
    } :
    {
      attributes: currentAttributes(element),
      classes: currentClasses(element),
    };
}


/**
 * Returns a dictionary of the element's current attributes.
 * 
 * @param {Element} element - the element to examine
 * @returns {object} a dictionary of the element's current attributes
 */
function currentAttributes(element) {
  const attributes = {};
  Array.prototype.forEach.call(element.attributes, attribute => {
    // TODO: Convert custom attributes to properties
    if (attribute.name !== 'class' && attribute.name !== 'style') {
      attributes[attribute.name] = attribute.value;
    }
  });
  return attributes;
}


/**
 * Returns a dictionary of the element's current classes.
 * 
 * @param {Element} element - the element to examine
 * @returns {object} a dictionary of the element's current classes
 */
function currentClasses(element) {
  const result = {};
  Array.prototype.forEach.call(element.classList, className =>
    result[className] = true
  );
  return result;
}


/**
 * Returns a dictionary of the element's current styles.
 *
 * @param {(HTMLElement|SVGElement)} element - the element to update
 * @returns {object} a dictionary of the element's current styles
 */
function currentStyles(element) {
  const styleProps = {};
  Array.prototype.forEach.call(element.style, key => {
    styleProps[key] = element.style[key];
  });
  return styleProps;
}


// Given a space-separated string of class names like "foo bar", return a props
// object like { foo: true, bar: true }.
function parseClassProps(text) {
  const result = {};
  const classes = text.split(' ');
  classes.forEach(className => {
    result[className] = true
  });
  return result;
}


// Given a semicolon-separated set of CSS rules like, return a props object.
// Example: when called with "background: black; color: white", this returns
// { background: 'black', color: 'white' }.
function parseStyleProps(text) {
  const result = {};
  const rules = text.split(';');
  rules.forEach(rule => {
    if (rule.length > 0) {
      const parts = rule.split(':');
      const name = parts[0].trim();
      const value = parts[1].trim();
      result[name] = value;
    }
  });
  return result;
}


// If we're changing an attribute outside of rendering, the element is being
// directly modified by its host. Update our notion of the element's "original"
// props, and give the component a chance to re-render based on this new
// information.
//
// This is important when, for example, a mixin or component wants to provide a
// default value for an attribute. Suppose a mixin wants to set a default
// tabindex of zero if no tabindex is provided by the host. If/when the host
// eventually sets a tabindex, the mixin should see the change, and let the
// host's preferred tabindex stick instead of overwriting it with its default
// tabindex of zero.
//
function updateOriginalProp(element, name, value) {
  const original = Object.assign({}, element.state.original);
  switch (name) {
    
    case 'class':
      Object.assign(original, {
        classes: parseClassProps(value)
      });
      break;

    case 'style':
      Object.assign(original, {
        style: parseStyleProps(value)
      });
      break;
    
    default:
      if (!original.attributes) {
        original.attributes = {};
      }
      original.attributes[name] = value;
      break;
  }
  element.setState({ original });
}

import * as props from '../mixins/props.js';
import symbols from './symbols.js';
import Symbol from './Symbol.js';


const originalPropsKey = Symbol('originalProps');


/**
 * Mixin for rendering properties on a component's host.
 */
export default function HostPropsMixin(Base) {
  return class HostProps extends Base {

    // TODO: Make render itself synchronous?
    [symbols.render]() {
      const base = super[symbols.render] ? super[symbols.render]() : Promise.resolve();
      return base.then(() => {
        // console.log(`ReactiveMixin: render`);

        // If the component or its mixins want to apply properties/attributes to
        // the component host, collect those.
        if (this.hostProps) {
          // First gather the original attributes on the component.
          if (this[originalPropsKey] === undefined) {
            this[originalPropsKey] = props.getProps(this);
          }
          // Collect an updated set of properties/attributes.
          const hostProps = this.hostProps(this[originalPropsKey]);
          // Apply those to the host.
          props.applyProps(this, hostProps);
        }
      });
    }

    setAttribute(name, value) {
      if (name === 'style' && !this[symbols.rendering]) {
        // console.log(`${this.localName}: setAttribute style, ${value}`);
        this.style = value;
      } else {
        super.setAttribute(name, value);
      }
    }

    get style() {
      return super.style;
    }
    set style(style) {
      let value = style;
      if (!this[symbols.rendering]) {
        // console.log(`${this.localName}: style = ${style}`);
        const current = this.style.cssText;
        if (style !== current) {
          const styleProps = parseStyleProps(this.style.cssText);
          const newProps = parseStyleProps(style);
          Object.assign(styleProps, newProps);
          value = props.formatStyleProps(styleProps);
        }
      }
      super.style = value;
    }
  }
}


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

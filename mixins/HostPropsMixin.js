import * as props from '../mixins/props.js';
import symbols from './symbols.js';
import Symbol from './Symbol.js';


const originalPropsKey = Symbol('originalProps');
const originalStyleKey = Symbol('originalStyle');
const latestStylePropsKey = Symbol('latestStyleProps');


/**
 * Mixin for rendering properties on a component's host.
 */
export default function HostPropsMixin(Base) {
  return class HostProps extends Base {

    // TODO: Make render itself synchronous?
    [symbols.render]() {
      if (super[symbols.render]) { super[symbols.render](); }

      // If the component or its mixins want to apply properties/attributes to
      // the component host, collect those.
      if (this.hostProps) {
        // First gather the original attributes on the component.
        if (this[originalPropsKey] === undefined) {
          this[originalPropsKey] = props.get(this);
          this[originalStyleKey] = this.style.cssText;
        }

        // Collect an updated set of properties/attributes.
        const hostProps = this.hostProps(this[originalPropsKey]);

        // Save style props in case we need to apply them again later.
        this[latestStylePropsKey] = hostProps.style;

        // Apply those to the host.
        props.apply(this, hostProps);
      }
    }

    setAttribute(name, value) {
      if (name === 'style' && !this[symbols.rendering]) {
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
        const newProps = parseStyleProps(style)
        const styleProps = props.merge(
          newProps,
          this[latestStylePropsKey]
        );
        value = props.formatStyleProps(styleProps);
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

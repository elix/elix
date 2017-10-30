import * as props from './props.js';
import Symbol from './Symbol.js';
import symbols from './symbols.js';


const originalPropsKey = Symbol('originalProps');
const originalStyleKey = Symbol('originalStyle');
const latestStylePropsKey = Symbol('latestStyleProps');


export default function RenderPropsMixin(Base) {
  return class RenderProps extends Base {

    get props() {
      return super.props || {};
    }

    get originalProps() {
      return this[originalPropsKey];
    }

    [symbols.render]() {
      if (super[symbols.render]) { super[symbols.render](); }

      // First gather the original attributes on the component.
      if (this[originalPropsKey] === undefined) {
        this[originalPropsKey] = props.get(this);
        this[originalStyleKey] = this.style.cssText;
      }

      // Collect an updated set of properties/attributes.
      const newProps = this.props;

      // Save style props in case we need to apply them again later.
      this[latestStylePropsKey] = newProps.style;

      // Apply those to the host.
      props.apply(this, newProps);
    }

    setAttribute(name, value) {
      const adjusted = name === 'style' && !this[symbols.rendering] ?
        mergeLatestStyleUpdates(this, value) :
        value; // No adjustments necessary
      super.setAttribute(name, adjusted);
    }

    get style() {
      return super.style;
    }
    set style(style) {
      const adjusted = !this[symbols.rendering] ?
        mergeLatestStyleUpdates(this, style) :
        style; // No adjustments necessary
      super.style = adjusted;
    }

  }
}


// Merge the latest style updates applied via props on top of the given style.
function mergeLatestStyleUpdates(element, style) {
  const newProps = parseStyleProps(style);
  const styleProps = props.merge(
    newProps,
    element[latestStylePropsKey]
  );
  return props.formatStyleProps(styleProps);
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

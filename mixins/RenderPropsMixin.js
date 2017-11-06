import * as props from './props.js';
import Symbol from './Symbol.js';
import symbols from './symbols.js';


const originalPropsKey = Symbol('originalProps');
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
      }

      // Collect an updated set of properties/attributes.
      const newProps = this.props;

      // Save style props in case we need to apply them again later.
      this[latestStylePropsKey] = newProps.style;

      // Apply those to the host.
      props.apply(this, newProps);
    }

    setAttribute(name, value) {
      const adjusted = updateOriginalProp(this, name, value);
      super.setAttribute(name, adjusted);
    }

    get style() {
      return super.style;
    }
    set style(style) {
      const adjusted = updateOriginalProp(this, 'style', style);
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


function updateOriginalProp(element, name, value) {
  let adjusted = value;
  if (!element[symbols.rendering]) {
    if (name === 'style') {
      const newProps = parseStyleProps(value);
      if (element[originalPropsKey]) {
        element[originalPropsKey][name] = newProps;
      }
      const styleProps = props.merge(
        newProps,
        element[latestStylePropsKey]
      );
      adjusted = props.formatStyleProps(styleProps);
    } else if (element[originalPropsKey]) {
      element[originalPropsKey].attributes[name] = value;
    }
    // Since calculated props may depend on originalProps, queue up a request to
    // re-render.
    Promise.resolve().then(() => {
      element.render({ force: true });
    });
  }
  return adjusted;
}

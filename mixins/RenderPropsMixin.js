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
        // this[originalStyleKey] = this.style.cssText;
      }

      // Collect an updated set of properties/attributes.
      const newProps = this.props;

      // Save style props in case we need to apply them again later.
      // this[latestStylePropsKey] = hostProps.style;

      // Apply those to the host.
      props.apply(this, newProps);
    }

  }
}

import * as symbols from './symbols.js';
import ReactiveElement from './ReactiveElement.js';


/**
 * An element with no visible appearance
 * 
 * In some situations, you may be using a component that defines an
 * [element role](customizing#element-roles) that you don't want to fill.
 * In such cases, you can indicate that the `Hidden` element class should be
 * used to fill that role. The component will create an instance of this class
 * inside its shadow tree, but the element will be invisible to the user.
 * 
 * @inherits ReactiveElement
 */
class Hidden extends ReactiveElement {

  [symbols.componentDidMount]() {
    super[symbols.componentDidMount]();
    this.setAttribute('hidden', '');
  }

}


customElements.define('elix-hidden', Hidden);
export default Hidden;

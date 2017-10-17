import HostPropsMixin from '../mixins/HostPropsMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import * as props from '../mixins/props.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import symbols from '../mixins/symbols.js';


const Base =
  HostPropsMixin(
  ReactiveMixin(
  ShadowTemplateMixin(
    HTMLElement
  )));


class ModalBackdrop extends Base {

  hostProps(original) {
    const base = super.hostProps ? super.hostProps() : {};
    const role = base.attributes && base.attributes.role || 'none';
    return props.merge(base, {
      attributes: {
        role
      },
      style: {
        background: 'black',
        height: '100%',
        left: 0,
        opacity: 0.2,
        position: 'absolute',
        top: 0,
        width: '100%'
      }
    });
  }

  get [symbols.template]() {
    return `<slot></slot>`;
  }

}


customElements.define('elix-modal-backdrop', ModalBackdrop);
export default ModalBackdrop;

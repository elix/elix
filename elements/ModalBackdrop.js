import ElementBase from './ElementBase.js';
import * as props from '../mixins/props.js';
import symbols from '../mixins/symbols.js';


class ModalBackdrop extends ElementBase {

  get props() {
    const base = super.props || {};
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

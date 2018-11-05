import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import Button from './Button.js';


/**
 * A button with no border or background in its normal state.
 * 
 * `SeamlessButton` is useful for clickable subelements inside a more complex
 * component.
 * 
 * @inherits Button
 */
class SeamlessButton extends Button {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.inner.addEventListener('mousedown', event => {
      if (this.state.focusOnAncestor) {
        // If we have a focusable ancestor, refer the focus to it.
        const focusableAncestor = findFocusableAncestor(this);
        if (focusableAncestor) {
          focusableAncestor.focus();
        }
        // Prevent the default focus-on-mousedown behavior.
        event.preventDefault();
      }
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      focusOnAncestor: false
    });
  }

  /**
   * If true, the component will avoid accepting focus if the user clicks on it.
   * Instead, on mousedown it will forward the focus to the first ancestor that
   * has a zero or positive `tabindex` or, if no such ancestor exists, the
   * document body.
   * 
   * @type {boolean}
   * @default false
   */
  get focusOnAncestor() {
    return this.state.focusOnAncestor;
  }
  set focusOnAncestor(focusOnAncestor) {
    this.setState({ focusOnAncestor });
  }

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, SeamlessButton, symbols.template);
    const styleTemplate = template.html`
      <style>
        #inner {
          background: none;
          border: none;
          padding: 0;
        }
      </style>
    `;
    result.content.appendChild(styleTemplate.content);
    return result;
  }

  get updates() {
    const base = super.updates;
    const baseTabIndex = base.attributes ? base.attributes.tabindex : null;
    const tabindex = this.state.focusOnAncestor ? '-1' : baseTabIndex;
    return merge(base, {
      attributes: {
        tabindex
      }
    });
  }

}


function findFocusableAncestor(element) {
  // @ts-ignore
  const parent = element.parentNode instanceof ShadowRoot ?
    element.parentNode.host :
    element.parentNode;
  if (!parent) {
    return null;
  }
  if (parent === document.body || parent.tabIndex >= 0) {
    return parent;
  }
  return findFocusableAncestor(parent);
}


customElements.define('elix-seamless-button', SeamlessButton);
export default SeamlessButton;

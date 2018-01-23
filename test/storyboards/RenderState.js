import { merge } from '../../src/updates.js';
import { substantiveElements } from '../../src/content.js';
import ElementBase from '../../src/ElementBase.js';
import SlotContentMixin from '../../src/SlotContentMixin.js';
import symbols from '../../src/symbols.js';


const Base =
  SlotContentMixin(
    ElementBase
  );


class RenderState extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      testState: {}
    });
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: block;
          margin: 2em 0;
        }

        #testState {
          color: #666;
          margin-bottom: 1em;
        }
      </style>
      <div id="testState"></div>
      <slot></slot>
    `;
  }

  [symbols.render]() {
    if (super[symbols.render]) { super[symbols.render](); }
    if (!this.state.content) {
      return;
    }
    const elements = substantiveElements(this.state.content);
    if (!elements || elements.length < 1) {
      return;
    }
    const inner = elements[0];
    customElements.whenDefined(inner.localName)
    .then(() => {
      inner.setState(this.state.testState);
    });
  }

  get testState() {
    return this.state.testState;
  }
  set testState(testState) {
    const parsed = typeof testState === 'string' ?
      JSON.parse(testState) :
      testState;
    this.setState({
      testState: parsed
    });
  }

  get updates() {
    const textContent = Object.keys(this.state.testState).length > 0 ?
      JSON.stringify(this.state.testState) :
      'default state';
    return merge(super.updates, {
      $: {
        testState: { textContent }
      }
    });
  }

}


customElements.define('render-state', RenderState);

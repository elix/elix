import { merge } from '../../src/updates.js';
import { substantiveElements } from '../../src/content.js';
import ElementBase from '../../src/ElementBase.js';
import SlotContentMixin from '../../src/SlotContentMixin.js';
import * as symbols from '../../src/symbols.js';


const Base =
  SlotContentMixin(
    ElementBase
  );


class RenderState extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      fixtureState: {}
    });
  }

  get [symbols.contentSlot]() {
    return this.$.fixtureSlot;
  }

  get fixture() {
    if (!this.state.content) {
      return;
    }
    const elements = substantiveElements(this.state.content);
    if (!elements || elements.length < 1) {
      return;
    }
    // Look for an element (or subelement) with class "fixture".
    const fixtures = elements.map(element =>
      element.classList.contains('fixture') ?
        element :
        element.querySelector('.fixture')
    ).filter(item => item !== null);

    // If no fixture was found, return the first element.
    const fixture = fixtures[0] || elements[0];
    return fixture;
  }

  get fixtureState() {
    return this.state.fixtureState;
  }
  set fixtureState(fixtureState) {
    const parsed = typeof fixtureState === 'string' ?
      JSON.parse(fixtureState) :
      fixtureState;
    this.setState({
      fixtureState: parsed
    });
  }

  [symbols.render]() {
    if (super[symbols.render]) { super[symbols.render](); }
    const fixture = this.fixture;
    if (fixture) {
      customElements.whenDefined(fixture.localName)
      .then(() => {
        fixture.setState(this.state.fixtureState);
      });
    }
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: flex;
          margin: 5em 0;
        }

        #fixtureContainer {
          overflow: hidden;
          position: relative;
        }

        #description {
          flex: 1;
          margin-left: 3em;
        }

        ::slotted(p) {
          margin-top: 0;
        }
        
        #fixtureState {
          color: #666;
          margin-bottom: 1em;
        }
      </style>
      <div id="fixtureContainer">
        <slot id="fixtureSlot" name="fixture"></slot>
      </div>
      <div id="description">
        <slot></slot>
        <pre id="fixtureState"></pre>
      </div>
    `;
  }

  get updates() {
    const textContent = Object.keys(this.state.fixtureState).length > 0 ?
      JSON.stringify(this.state.fixtureState, null, 2) :
      '';
    return merge(super.updates, {
      $: {
        fixtureState: { textContent }
      }
    });
  }

}


customElements.define('render-state', RenderState);

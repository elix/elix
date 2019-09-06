import { substantiveElements } from '../../src/content.js';
import * as internal from '../../src/internal.js';
import * as template from '../../src/template.js';
import ReactiveElement from '../../src/ReactiveElement.js';
import SlotContentMixin from '../../src/SlotContentMixin.js';


const Base =
  SlotContentMixin(
    ReactiveElement
  );


class RenderState extends Base {

  get [internal.defaultState]() {
    const result = Object.assign(super[internal.defaultState], {
      fixture: null,
      fixtureState: {}
    });
    result.onChange('content', state => {
      if (!state.content) {
        return {
          fixture: null
        };
      }

      const elements = substantiveElements(state.content);
      if (!elements || elements.length < 1) {
        return {
          fixture: null
        };
      }

      // Look for an element (or subelement) with class "fixture".
      const fixtures = elements.map(element =>
        element.classList.contains('fixture') ?
          element :
          element.querySelector('.fixture')
      ).filter(item => item !== null);
  
      // If no fixture was found, return the first element.
      const fixture = fixtures[0] || elements[0];
      return {
        fixture
      };
    });
    return result;
  }

  get [internal.contentSlot]() {
    return this[internal.ids].fixtureSlot;
  }

  get fixture() {
    return this[internal.state].fixture;
  }

  get fixtureState() {
    return this[internal.state].fixtureState;
  }
  set fixtureState(fixtureState) {
    const parsed = typeof fixtureState === 'string' ?
      JSON.parse(fixtureState) :
      fixtureState;
    this[internal.setState]({
      fixtureState: parsed
    });
  }

  [internal.render](changed) {
    if (super[internal.render]) { super[internal.render](changed); }
    if (changed.fixture || changed.fixtureState) {
      const { fixture, fixtureState } = this[internal.state];
      if (fixture && fixtureState) {
        customElements.whenDefined(fixture.localName)
        .then(() => {
          // Wait for fixture to do its initial render.
          return fixture[internal.setState]({});
        })
        .then(() => {
          // Force an update of the fixture's state.
          fixture[internal.setState](fixtureState);
        });
      }
      const textContent = Object.keys(fixtureState).length > 0 ?
        JSON.stringify(fixtureState, null, 2) :
        '';
      this[internal.ids].fixtureState.textContent = textContent;
    }
  }

  get [internal.template]() {
    return template.html`
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

}


customElements.define('render-state', RenderState);

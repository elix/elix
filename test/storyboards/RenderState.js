import { substantiveElements } from "../../src/base/content.js";
import {
  contentSlot,
  defaultState,
  ids,
  render,
  setState,
  state,
  stateEffects,
  template,
} from "../../src/base/internal.js";
import SlotContentMixin from "../../src/base/SlotContentMixin.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

const Base = SlotContentMixin(ReactiveElement);

class RenderState extends Base {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      fixture: null,
      fixtureState: {},
    });
  }

  // @ts-ignore
  get [contentSlot]() {
    const slot = this[ids].fixtureSlot;
    return slot instanceof HTMLSlotElement ? slot : null;
  }

  get fixture() {
    return this[state].fixture;
  }

  get fixtureState() {
    return this[state].fixtureState;
  }
  set fixtureState(fixtureState) {
    const parsed =
      typeof fixtureState === "string"
        ? JSON.parse(fixtureState)
        : fixtureState;
    this[setState]({
      fixtureState: parsed,
    });
  }

  [render](changed) {
    if (super[render]) {
      super[render](changed);
    }
    if (changed.fixture || changed.fixtureState) {
      const { fixture, fixtureState } = this[state];
      if (fixture && fixtureState) {
        customElements
          .whenDefined(fixture.localName)
          .then(() => {
            // Wait for fixture to do its initial render.
            return fixture[setState]({});
          })
          .then(() => {
            // Force an update of the fixture's state.
            fixture[setState](fixtureState);
          });
      }
      const textContent =
        Object.keys(fixtureState).length > 0
          ? JSON.stringify(fixtureState, null, 2)
          : "";
      this[ids].fixtureState.textContent = textContent;
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    if (changed.content) {
      if (!state.content) {
        Object.assign(effects, {
          fixture: null,
        });
      } else {
        const elements = substantiveElements(state.content);
        if (!elements || elements.length < 1) {
          Object.assign(effects, {
            fixture: null,
          });
        } else {
          // Look for an element (or subelement) with class "fixture".
          const fixtures = elements
            .map((element) =>
              element.classList.contains("fixture")
                ? element
                : element.querySelector(".fixture")
            )
            .filter((item) => item !== null);

          // If no fixture was found, return the first element.
          const fixture = fixtures[0] || elements[0];
          Object.assign(effects, {
            fixture,
          });
        }
      }
    }

    return effects;
  }

  get [template]() {
    return templateFrom.html`
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

customElements.define("render-state", RenderState);

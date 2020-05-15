import {
  defaultState,
  render,
  startEffect,
  state,
  template,
} from "../../src/base/internal.js";
import TransitionEffectMixin from "../../src/base/TransitionEffectMixin.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";
import { assert } from "../testHelpers.js";

const Base = TransitionEffectMixin(ReactiveElement);

// An element with open and close effects. When completely closed, the element
// is hidden. We test both effects because we can encounter different conditions
// when showing or hiding an element during an effect.
class TransitionEffectTest extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      effect: "close",
      effectPhase: "after",
    });
  }

  [render](changed) {
    super[render](changed);
    const effect = this[state].effect;
    const phase = this[state].effectPhase;
    const display = effect === "close" && phase === "after" ? "none" : "block";
    const opacity =
      (effect === "open" && phase !== "before") ||
      (effect === "close" && phase === "before")
        ? 1
        : 0;
    Object.assign(this.style, {
      display,
      opacity,
    });
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          transition: opacity 0.01s;
        }
      </style>
    `;
  }
}
customElements.define("transition-effect-test", TransitionEffectTest);

describe("TransitionEffectMixin", function () {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("goes through effect phases when opened", (done) => {
    const fixture = new TransitionEffectTest();
    container.appendChild(fixture);
    const states = [];
    fixture.addEventListener("effect-phase-changed", (event) => {
      states.push(event["detail"].effectPhase);
      if (event["detail"].effectPhase === "after") {
        assert.deepEqual(states, ["before", "during", "after"]);
        done();
      }
    });
    fixture[startEffect]("open");
  });

  it("goes through effect phases when closed", (done) => {
    const fixture = new TransitionEffectTest();
    fixture.opened = true;
    container.appendChild(fixture);
    const states = [];
    fixture.addEventListener("effect-phase-changed", (event) => {
      states.push(event["detail"].effectPhase);
      if (event["detail"].effectPhase === "after") {
        assert.deepEqual(states, ["before", "during", "after"]);
        done();
      }
    });
    fixture[startEffect]("close");
  });
});

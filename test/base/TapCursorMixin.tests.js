import { setState, state } from "../../src/base/internal.js";
import TapCursorMixin from "../../src/base/TapCursorMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import ShadowTemplateMixin from "../../src/core/ShadowTemplateMixin.js";
import * as mockInteractions from "../mockInteractions.js";
import { assert } from "../testHelpers.js";

class TapCursorTest extends TapCursorMixin(
  ReactiveMixin(ShadowTemplateMixin(HTMLElement))
) {
  connectedCallback() {
    super.connectedCallback();
    const items = Array.prototype.slice.call(this.children);
    this[setState]({
      items,
      currentIndex: -1,
    });
  }
}
customElements.define("tap-selection-test", TapCursorTest);

describe("TapCursorMixin", function () {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("sets the tapped item as the selected item", (done) => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    assert.equal(fixture[state].currentIndex, -1);
    const item = fixture[state].items[0];
    fixture.addEventListener("mousedown", () => {
      assert.equal(fixture[state].currentIndex, 0);
      done();
    });
    mockInteractions.dispatchSyntheticMouseEvent(item, "mousedown");
  });

  it("ignores right clicks", (done) => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    assert.equal(fixture[state].currentIndex, -1);
    const item = fixture[state].items[0];
    fixture.addEventListener("mousedown", () => {
      assert.equal(
        fixture[state].currentIndex,
        -1,
        "handled mousedown even when right button was pressed"
      );
      done();
    });
    mockInteractions.dispatchSyntheticMouseEvent(item, "mousedown", {
      button: 2,
    });
  });
});

function createSampleElement() {
  const fixture = new TapCursorTest();
  ["Zero", "One", "Two"].forEach((text) => {
    const div = document.createElement("div");
    div.textContent = text;
    fixture.appendChild(div);
  });
  return fixture;
}

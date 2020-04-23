import * as internal from "../../src/base/internal.js";
import TapSelectionMixin from "../../src/base/TapSelectionMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import ShadowTemplateMixin from "../../src/core/ShadowTemplateMixin.js";
import * as mockInteractions from "../mockInteractions.js";
import { assert } from "../testHelpers.js";

class TapSelectionTest extends TapSelectionMixin(
  ReactiveMixin(ShadowTemplateMixin(HTMLElement))
) {
  connectedCallback() {
    super.connectedCallback();
    const items = Array.prototype.slice.call(this.children);
    this[internal.setState]({
      items,
      currentIndex: -1,
    });
  }
}
customElements.define("tap-selection-test", TapSelectionTest);

describe("TapSelectionMixin", function () {
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
    assert.equal(fixture[internal.state].currentIndex, -1);
    const item = fixture[internal.state].items[0];
    fixture.addEventListener("mousedown", () => {
      assert.equal(fixture[internal.state].currentIndex, 0);
      done();
    });
    mockInteractions.dispatchSyntheticMouseEvent(item, "mousedown");
  });

  it("ignores right clicks", (done) => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    assert.equal(fixture[internal.state].currentIndex, -1);
    const item = fixture[internal.state].items[0];
    fixture.addEventListener("mousedown", () => {
      assert.equal(
        fixture[internal.state].currentIndex,
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
  const fixture = new TapSelectionTest();
  ["Zero", "One", "Two"].forEach((text) => {
    const div = document.createElement("div");
    div.textContent = text;
    fixture.appendChild(div);
  });
  return fixture;
}

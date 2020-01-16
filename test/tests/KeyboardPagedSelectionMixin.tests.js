import { assert } from '../chai.js';
import * as internal from "../../src/internal.js";
import KeyboardPagedSelectionMixin from "../../src/KeyboardPagedSelectionMixin.js";
import ReactiveMixin from "../../src/ReactiveMixin.js";
import ShadowTemplateMixin from "../../src/ShadowTemplateMixin.js";

const itemHeight = 100;

const Base = KeyboardPagedSelectionMixin(ReactiveMixin(ShadowTemplateMixin(HTMLElement)));

class KeyboardPagedSelectionTest extends Base {
  connectedCallback() {
    super.connectedCallback();
    const items = Array.prototype.slice.call(this.children);
    this[internal.setState]({
      items,
      selectedIndex: -1
    });
  }
}
customElements.define(
  "keyboard-paged-selection-test",
  KeyboardPagedSelectionTest
);

describe("KeyboardPagedSelectionMixin", function() {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("If bottom item not selected, Page Down selects bottom item", () => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture[internal.setState]({ selectedIndex: 0 });
    const handled = fixture[internal.keydown]({
      key: "PageDown"
    });
    assert(handled);
    assert.equal(fixture[internal.state].selectedIndex, 1);
  });

  it("If bottom item selected, Page Down advances selection by one page", () => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture[internal.setState]({ selectedIndex: 1 });
    const handled = fixture[internal.keydown]({
      key: "PageDown"
    });
    assert(handled);
    assert.equal(fixture[internal.state].selectedIndex, 3);
  });

  it("If less than one page remaining, Page Down selects last item", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture[internal.setState]({ selectedIndex: 3 });
    fixture.addEventListener("scroll", () => {
      const handled = fixture[internal.keydown]({
        key: "PageDown"
      });
      assert(handled);
      assert.equal(fixture[internal.state].selectedIndex, 4);
      done();
    });
    fixture.scrollTop = 2 * itemHeight; // So index 2 is at top of viewport.
  });

  it("If last item already selected, Page Down has no effect", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture[internal.setState]({ selectedIndex: 4 });
    fixture.addEventListener("scroll", () => {
      const handled = fixture[internal.keydown]({
        key: "PageDown"
      });
      assert(!handled);
      assert.equal(fixture[internal.state].selectedIndex, 4);
      done();
    });
    fixture.scrollTop = 3 * itemHeight; // So index 3 is at top of viewport.
  });
});

function createSampleElement() {
  const fixture = new KeyboardPagedSelectionTest();

  // Force scroll: make element only tall enough to show 2 items at a time.
  const itemsToShow = 2;
  fixture.style.display = "block";
  fixture.style.height = `${itemsToShow * itemHeight}px`;
  fixture.style.overflowY = "auto";

  // Add items.
  ["Zero", "One", "Two", "Three", "Four"].forEach(text => {
    const div = document.createElement("div");
    div.textContent = text;
    div.style.height = `${itemHeight}px`;
    fixture.appendChild(div);
  });
  return fixture;
}

import { assert } from "../testHelpers.js";
import * as internal from "../../src/internal.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import SelectionInViewMixin from "../../src/SelectionInViewMixin.js";
import ShadowTemplateMixin from "../../src/core/ShadowTemplateMixin.js";

const itemHeight = 100;

class SelectionInViewTest extends SelectionInViewMixin(
  ReactiveMixin(ShadowTemplateMixin(HTMLElement))
) {
  connectedCallback() {
    super.connectedCallback();
    const items = Array.prototype.slice.call(this.children);
    this[internal.setState]({
      items,
      selectedIndex: -1
    });
  }
}
customElements.define("selection-in-view-test", SelectionInViewTest);

describe("SelectionInViewMixin", function() {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("Scrolls down to bring item clipped by bottom edge fully into view", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture.addEventListener("scroll", () => {
      // Just check that styles are applied, not really part of testing the fixture.
      assert.equal(fixture.style.height, "150px");
      assert.equal(fixture.scrollTop, 50);
      done();
    });
    fixture[internal.setState]({ selectedIndex: 1 });
  });

  it("Scrolls down to bring item below bottom edge fully into view", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture.addEventListener("scroll", () => {
      assert.equal(fixture.scrollTop, 150);
      done();
    });
    fixture[internal.setState]({ selectedIndex: 2 });
  });

  it("Scrolls up to bring item above top edge fully into view", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture.scrollTop = 150; // Scrolled all the way to bottom.
    fixture.addEventListener("scroll", () => {
      assert.equal(fixture.scrollTop, 0);
      done();
    });
    fixture[internal.setState]({ selectedIndex: 0 });
  });
});

function createSampleElement() {
  const fixture = new SelectionInViewTest();

  // Force scroll: make element only tall enough to show 1.5 items at a time.
  const itemsToShow = 1.5;
  fixture.style.display = "block";
  fixture.style.height = `${itemsToShow * itemHeight}px`;
  fixture.style.overflowY = "auto";

  // Add items.
  ["Zero", "One", "Two"].forEach(text => {
    const div = document.createElement("div");
    div.textContent = text;
    div.style.height = `${itemHeight}px`;
    fixture.appendChild(div);
  });
  return fixture;
}

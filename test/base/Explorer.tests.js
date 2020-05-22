import Explorer from "../../define/Explorer.js";
import { goLast, goNext, setState, state } from "../../src/base/internal.js";
import { assert } from "../testHelpers.js";

describe("Explorer", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("associates slotted proxies with each item", async () => {
    const fixture = new Explorer();
    fixture.innerHTML = `
      <button slot="proxy">Proxy one</button>
      <button slot="proxy">Proxy two</button>
      <button slot="proxy">Proxy three</button>
      <div aria-label="Label one">Item one</div>
      <div aria-label="Label two">Item two</div>
      <div aria-label="Label three">Item three</div>
    `;
    container.appendChild(fixture);
    // Wait for component to render.
    // Wait for content, which requires event/timeout timing.
    await new Promise((resolve) => {
      setTimeout(resolve);
    });
    const proxies = fixture.proxies;
    assert.equal(proxies.length, 3);
    assert.equal(proxies[0], fixture.children[0]);
  });

  it("creates default proxies for each item", async () => {
    const fixture = new Explorer();
    fixture.proxyPartType = "button";
    fixture.innerHTML = `
      <div aria-label="Label one">Item one</div>
      <div aria-label="Label two">Item two</div>
      <div aria-label="Label three">Item three</div>
    `;
    container.appendChild(fixture);
    // Wait for component to render.
    // Wait for content, which requires event/timeout timing.
    await new Promise((resolve) => {
      setTimeout(resolve);
    });
    const proxies = fixture.proxies;
    assert.equal(proxies.length, 3);
    assert(proxies[0] instanceof HTMLButtonElement);
  });

  it("sets canGoNext/canGoPrevious with no wrapping", () => {
    const fixture = new Explorer();
    assert(!fixture[state].cursorOperationsWrap);

    fixture[setState]({
      items: [
        document.createElement("div"),
        document.createElement("div"),
        document.createElement("div"),
      ],
    });

    // Start of list
    assert.equal(fixture.currentIndex, 0);
    assert(fixture.canGoNext);
    assert(!fixture.canGoPrevious);

    // Middle of list
    fixture[goNext]();
    assert(fixture.canGoNext);
    assert(fixture.canGoPrevious);

    // End of list
    fixture[goLast]();
    assert(!fixture.canGoNext);
    assert(fixture.canGoPrevious);
  });

  it("sets canGoNext/canGoPrevious with wrapping", () => {
    const fixture = new Explorer();
    fixture[setState]({ cursorOperationsWrap: true });

    fixture[setState]({
      items: [
        document.createElement("div"),
        document.createElement("div"),
        document.createElement("div"),
      ],
    });

    // Start of list
    assert.equal(fixture.currentIndex, 0);
    assert(fixture.canGoNext);
    assert(fixture.canGoPrevious);

    // End of list
    fixture[goLast]();
    assert(fixture.canGoNext);
    assert(fixture.canGoPrevious);
  });
});

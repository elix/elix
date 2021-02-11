import {
  defaultState,
  raiseChangeEvents,
  setState,
} from "../../src/base/internal.js";
import ItemsAPIMixin from "../../src/base/ItemsAPIMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";

class ItemsAPITest extends ItemsAPIMixin(ReactiveMixin(HTMLElement)) {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      items: null,
    });
  }
}
customElements.define("items-items-test", ItemsAPITest);

describe("ItemsAPIMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("raises items-changed event", async () => {
    const fixture = new ItemsAPITest();
    container.append(fixture);
    await new Promise((resolve) => {
      fixture.addEventListener("itemschange", () => {
        resolve(undefined);
      });
      // Arrange for raising of change events.
      fixture[raiseChangeEvents] = true;
      const items = Array(3).map(() => document.createElement("div"));
      fixture[setState]({ items });
    });
  });
});

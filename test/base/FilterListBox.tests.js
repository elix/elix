import FilterListBox from "../../src/base/FilterListBox.js";
import { state } from "../../src/base/internal.js";
import { assert } from "../testHelpers.js";

customElements.define("filter-list-box-test", FilterListBox);

describe("FilterListBox", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("ignores case and diacritic marks for filter purposes", async () => {
    const fixture = new FilterListBox();
    fixture.innerHTML = `
      <div>Apple</div>
      <div>Bänana</div>
      <div>Cherry</div>
      <div>Drágonfruit</div>
      <div>Elderberry</div>
    `;
    fixture.filter = "a";
    container.append(fixture);
    await Promise.resolve();
    assert.deepEqual(fixture[state].availableItemFlags, [
      true,
      true,
      false,
      true,
      false,
    ]);
  });
});

import NumberSpinBox from "../../define/NumberSpinBox.js";
import * as internal from "../../src/base/internal.js";
import { assert } from "../testHelpers.js";

const formElementsSupported = "ElementInternals" in window;

describe("NumberSpinBox", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("increments/decrements by 1 by default", () => {
    const fixture = new NumberSpinBox();
    assert.equal(fixture.value, 0);
    fixture.stepUp();
    assert.equal(fixture.value, 1);
    fixture.value = 0;
    fixture.stepDown();
    assert.equal(fixture.value, -1);
  });

  it("can increment/decrement by a custom step", () => {
    const fixture = new NumberSpinBox();
    fixture.step = 0.1;
    fixture.stepUp();
    assert.equal(fixture.value, 0.1);
    fixture.value = 0;
    fixture.stepDown();
    assert.equal(fixture.value, -0.1);
  });

  it("doesn't stepUp/stepDown beyond defined maximum/minimum values", () => {
    const fixture = new NumberSpinBox();
    assert.equal(fixture.value, 0);
    fixture.min = 1;
    fixture.max = 5;
    fixture.step = 2;
    assert.equal(fixture.value, 0); // Still allowed
    fixture.stepUp(); // 2
    fixture.stepUp(); // 4
    fixture.stepUp(); // Would be 6; ignored
    assert.equal(fixture.value, 4);
    fixture.stepDown(); // 2
    fixture.stepDown(); // Would be 0; ignored
    assert.equal(fixture.value, 2);
  });

  it("determines whether the user can step up or down", () => {
    const fixture = new NumberSpinBox();
    fixture.value = 0;
    // If no max/min, can always go up/down.
    assert(fixture[internal.state].canGoUp);
    assert(fixture[internal.state].canGoDown);
    fixture.min = 0;
    fixture.max = 10;
    assert(fixture[internal.state].canGoUp);
    assert(!fixture[internal.state].canGoDown);
    fixture.value = 1;
    assert(fixture[internal.state].canGoUp);
    assert(fixture[internal.state].canGoDown);
    fixture.value = 10;
    assert(!fixture[internal.state].canGoUp);
    assert(fixture[internal.state].canGoDown);
  });

  (formElementsSupported ? it : it.skip)(
    "recognizes non-numbers, or numbers out of range, as invalid",
    async () => {
      const fixture = new NumberSpinBox();
      container.append(fixture);
      fixture.value = "foo";
      await Promise.resolve(); // Wait for render.
      assert(!fixture.validity.valid);
      fixture.value = 0;
      fixture.min = 0;
      fixture.max = 10;
      await Promise.resolve();
      assert(fixture.validity.valid);
      fixture.value = 11;
      await Promise.resolve();
      assert(!fixture.validity.valid);
      fixture.value = 0;
      await Promise.resolve();
      assert(fixture.validity.valid);
      fixture.value = -1;
      await Promise.resolve();
      assert(!fixture.validity.valid);
    }
  );
});

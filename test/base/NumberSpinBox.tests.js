import { assert } from "../testHelpers.js";
import NumberSpinBox from "../../define/NumberSpinBox.js";

describe("NumberSpinBox", () => {
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
});

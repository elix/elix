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

  it("doesn't increment/decrement beyond defined maximum/minimum values", () => {
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
});

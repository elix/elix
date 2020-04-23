import DirectionSelectionMixin from "../../src/base/DirectionSelectionMixin.js";
import * as internal from "../../src/base/internal.js";
import { assert, sinon } from "../testHelpers.js";

class DirectionSelectionTest extends DirectionSelectionMixin(HTMLElement) {
  [internal.goFirst]() {}
  [internal.goLast]() {}
  [internal.goNext]() {}
  [internal.goPrevious]() {}
}
customElements.define("direction-selection-test", DirectionSelectionTest);

describe("DirectionSelectionMixin", () => {
  it("maps direction method calls to selection method calls", () => {
    const fixture = new DirectionSelectionTest();

    const goFirstSpy = sinon.spy(fixture, internal.goFirst);
    fixture[internal.goStart]();
    assert(goFirstSpy.calledOnce);

    const goLastSpy = sinon.spy(fixture, internal.goLast);
    fixture[internal.goEnd]();
    assert(goLastSpy.calledOnce);

    const goNextSpy = sinon.spy(fixture, internal.goNext);
    fixture[internal.goRight]();
    fixture[internal.goDown]();
    assert.equal(goNextSpy.callCount, 2);

    const goPreviousSpy = sinon.spy(fixture, internal.goPrevious);
    fixture[internal.goLeft]();
    fixture[internal.goUp]();
    assert.equal(goPreviousSpy.callCount, 2);
  });
});

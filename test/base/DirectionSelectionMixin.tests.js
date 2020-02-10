import { assert, sinon } from "../testHelpers.js";
import * as internal from "../../src/base/internal.js";
import DirectionSelectionMixin from "../../src/base/DirectionSelectionMixin.js";

class DirectionSelectionTest extends DirectionSelectionMixin(HTMLElement) {
  selectFirst() {}
  selectLast() {}
  selectNext() {}
  selectPrevious() {}
}
customElements.define("direction-selection-test", DirectionSelectionTest);

describe("DirectionSelectionMixin", () => {
  it("maps direction method calls to selection method calls", () => {
    const fixture = new DirectionSelectionTest();

    const selectFirstSpy = sinon.spy(fixture, "selectFirst");
    fixture[internal.goStart]();
    assert(selectFirstSpy.calledOnce);

    const selectLastSpy = sinon.spy(fixture, "selectLast");
    fixture[internal.goEnd]();
    assert(selectLastSpy.calledOnce);

    const selectNextSpy = sinon.spy(fixture, "selectNext");
    fixture[internal.goRight]();
    fixture[internal.goDown]();
    assert.equal(selectNextSpy.callCount, 2);

    const selectPreviousSpy = sinon.spy(fixture, "selectPrevious");
    fixture[internal.goLeft]();
    fixture[internal.goUp]();
    assert.equal(selectPreviousSpy.callCount, 2);
  });
});

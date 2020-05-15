import DirectionCursorMixin from "../../src/base/DirectionCursorMixin.js";
import {
  goDown,
  goEnd,
  goFirst,
  goLast,
  goLeft,
  goNext,
  goPrevious,
  goRight,
  goStart,
  goUp,
} from "../../src/base/internal.js";
import { assert, sinon } from "../testHelpers.js";

class DirectionCursorTest extends DirectionCursorMixin(HTMLElement) {
  [goFirst]() {}
  [goLast]() {}
  [goNext]() {}
  [goPrevious]() {}
}
customElements.define("direction-cursor-test", DirectionCursorTest);

describe("DirectionCursorMixin", () => {
  it("maps direction method calls to cursor method calls", () => {
    const fixture = new DirectionCursorTest();

    const goFirstSpy = sinon.spy(fixture, goFirst);
    fixture[goStart]();
    assert(goFirstSpy.calledOnce);

    const goLastSpy = sinon.spy(fixture, goLast);
    fixture[goEnd]();
    assert(goLastSpy.calledOnce);

    const goNextSpy = sinon.spy(fixture, goNext);
    fixture[goRight]();
    fixture[goDown]();
    assert.equal(goNextSpy.callCount, 2);

    const goPreviousSpy = sinon.spy(fixture, goPrevious);
    fixture[goLeft]();
    fixture[goUp]();
    assert.equal(goPreviousSpy.callCount, 2);
  });
});

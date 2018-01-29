import * as symbols from '../../src/symbols.js';
import DirectionSelectionMixin from '../../src/DirectionSelectionMixin.js';


class DirectionSelectionTest extends DirectionSelectionMixin(HTMLElement) {
  selectFirst() {}
  selectLast() {}
  selectNext() {}
  selectPrevious() {}
}
customElements.define('direction-selection-test', DirectionSelectionTest);


describe("DirectionSelectionMixin", () => {

  it("maps direction method calls to selection method calls", () => {
    const fixture = document.createElement('direction-selection-test');

    const selectFirstSpy = sinon.spy(fixture, 'selectFirst');
    fixture[symbols.goStart]();
    assert(selectFirstSpy.calledOnce);

    const selectLastSpy = sinon.spy(fixture, 'selectLast');
    fixture[symbols.goEnd]();
    assert(selectLastSpy.calledOnce);

    const selectNextSpy = sinon.spy(fixture, 'selectNext');
    fixture[symbols.goRight]();
    fixture[symbols.goDown]();
    assert.equal(selectNextSpy.callCount, 2);

    const selectPreviousSpy = sinon.spy(fixture, 'selectPrevious');
    fixture[symbols.goLeft]();
    fixture[symbols.goUp]();
    assert.equal(selectPreviousSpy.callCount, 2);
  });
});

import OpenCloseMixin from '../../src/OpenCloseMixin.js';
import ReactiveMixin from '../../src/ReactiveMixin.js';


const Base =
  OpenCloseMixin(
  ReactiveMixin(
    HTMLElement
  ));

class OpenCloseTest extends Base {}
customElements.define('open-close-test', OpenCloseTest);


describe("OpenCloseMixin", function() {

  it('opens and closes with opened property', () => {
    const fixture = new OpenCloseTest();
    assert(!fixture.opened);
    fixture.opened = true;
    assert(fixture.opened);
    fixture.opened = false;
  });

  it('opens and closes with open and close methods', async () => {
    const fixture = new OpenCloseTest();
    assert(fixture.closed);
    assert(!fixture.opened);
    await fixture.open();
    assert(!fixture.closed);
    assert(fixture.opened);
    await fixture.close(true);
    assert(fixture.closed);
    assert(!fixture.opened);
  });

});

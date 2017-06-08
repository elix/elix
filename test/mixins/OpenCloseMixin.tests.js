import { assert } from 'chai';
import OpenCloseMixin from '../../mixins/OpenCloseMixin.js';
import symbols from '../../mixins/symbols.js';


class OpenCloseTest extends OpenCloseMixin(HTMLElement) {}
customElements.define('open-close-test', OpenCloseTest);


describe("OpenCloseMixin", function() {

  it('opens and closes with opened property', () => {
    const fixture = document.createElement('open-close-test');
    assert(!fixture.opened);
    fixture.opened = true;
    assert(fixture.opened);
    fixture.opened = false;
  });

  it('opens and closes with open and close methods', done => {
    const fixture = document.createElement('open-close-test');
    assert(!fixture.opened);
    fixture.open().then(() => {
      assert(fixture.opened);
      fixture.close(true).then(result => {
        assert(!fixture.opened);
        assert(result);
        done();
      })
    });
  });

  it('opens and closes with toggle method', () => {
    const fixture = document.createElement('open-close-test');
    assert(!fixture.opened);
    fixture.toggle();    
    assert(fixture.opened);
    fixture.toggle();    
    assert(!fixture.opened);
  });

  it('invokes openedChanged if defined', () => {
    const fixture = document.createElement('open-close-test');
    fixture[symbols.openedChanged] = (opened) => {
      assert(opened);
    };
    fixture.opened = true;
  });

});

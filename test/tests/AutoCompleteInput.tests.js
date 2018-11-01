// import flushPolyfills from '../flushPolyfills.js';
import { dispatchSyntheticKeyboardEvent } from '../mockInteractions.js';
import * as symbols from '../../src/symbols.js';
import AutoCompleteInput from '../../src/AutoCompleteInput.js';


describe("AutoCompleteInput", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("can match against texts", async () => {
    const fixture = new AutoCompleteInput();
    fixture.texts = [
      'Canary',
      'Cat',
      'Dog'
    ];
    container.appendChild(fixture);
    // Synthetic event won't actually set value, so set it by hand.
    fixture.value = 'C';
    // Now trigger the key that should trigger AutoComplete.
    dispatchSyntheticKeyboardEvent(fixture, 'keydown', {
      key: 'C',
      keyCode: 'C'.charCodeAt(0)
    });
    // AutoComplete happens on a timeout, so wait.
    await new Promise(resolve => setTimeout(resolve));
    assert.equal(fixture.value, 'Canary');
  });

});

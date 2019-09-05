import * as symbols from '../../src/symbols.js';
import { default as AutoCompleteInput, autoComplete } from '../../src/AutoCompleteInput.js';


describe("AutoCompleteInput", () => {

  it("can match against texts", async () => {

    const fixture = new AutoCompleteInput();
    fixture.texts = [
      'Canary',
      'Cat',
      'Dog'
    ];
    fixture.value = 'C';
    autoComplete(fixture);
    fixture[symbols.renderChanges]();
    assert.equal(fixture.value, 'Canary');
  });

});

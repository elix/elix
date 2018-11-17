import { default as AutoCompleteInput, autoComplete } from '../../src/AutoCompleteInput.js';


describe("AutoCompleteInput", () => {

  it("can match against texts", async () => {

    const fixture = new AutoCompleteInput();
    fixture.texts = [
      'Canary',
      'Cat',
      'Dog'
    ];
    fixture.render();
    fixture.value = 'C';
    autoComplete(fixture);
    assert.equal(fixture.value, 'Canary');
  });

});

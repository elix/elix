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
    // Trigger a synthentic input event.
    const event = new InputEvent('input');
    fixture.$.inner.dispatchEvent(event);
    // AutoComplete happens on a timeout, so wait.
    await new Promise(resolve => setTimeout(resolve));
    assert.equal(fixture.value, 'Canary');
  });

});

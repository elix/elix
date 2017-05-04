import { assert } from 'chai';
import KeyboardPrefixSelectionMixin from '../../mixins//KeyboardPrefixSelectionMixin.js';
import symbols from '../../mixins//symbols.js';


class KeyboardPrefixSelectionTest extends KeyboardPrefixSelectionMixin(HTMLElement) {

  get items() {
    return this.children;
  }

  get selectedIndex() {
    return this._selectedIndex || -1;
  }
  set selectedIndex(index) {
    super.selectedIndex = index;
    this._selectedIndex = index;
  }

}
customElements.define('keyboard-prefix-selection-test', KeyboardPrefixSelectionTest);


describe("KeyboardPrefixSelectionMixin", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("selects the first item that begins with the typed prefix", () => {
    const fixture = createSampleElement();
    const prefix = 'blu'; // The keys we'll simulate.

    // Typing "b" moves to "Banana".
    fixture[symbols.keydown]({ keyCode: prefix.charCodeAt(0) });
    assert.equal(fixture.selectedIndex, 4);

    // Typing "l" moves to "Blackberry".
    fixture[symbols.keydown]({ keyCode: prefix.charCodeAt(1) });
    assert.equal(fixture.selectedIndex, 5);

    // Typing "u" moves to "Blueberry".
    fixture[symbols.keydown]({ keyCode: prefix.charCodeAt(2) });
    assert.equal(fixture.selectedIndex, 6);
  });

  it("backspace removes the last character added to the prefix", () => {
    const fixture = createSampleElement();
    const prefix = 'bl'; // The keys we'll simulate.

    // Typing "b" moves to "Banana".
    fixture[symbols.keydown]({ keyCode: prefix.charCodeAt(0) });
    assert.equal(fixture.selectedIndex, 4);

    // Typing "l" moves to "Blackberry".
    fixture[symbols.keydown]({ keyCode: prefix.charCodeAt(1) });
    assert.equal(fixture.selectedIndex, 5);

    // Typing Backspace moves back to "Banana".
    fixture[symbols.keydown]({ keyCode: 8 });
    assert.equal(fixture.selectedIndex, 4);
  });

  it("ignores typed keys that don't match", () => {
    const fixture = createSampleElement();
    // Typing "x" leaves selection alone (since it doesn't match).
    fixture[symbols.keydown]({ keyCode: 'x'.charCodeAt(0) });
    assert.equal(fixture.selectedIndex, -1);
  });

});


function createSampleElement() {
  const fixture = document.createElement('keyboard-prefix-selection-test');
  const items = [
    'Acai',
    'Acerola',
    'Apple',
    'Apricot',
    'Banana',
    'Blackberry',
    'Blueberry',
    'Cantaloupe',
    'Cherry',
    'Cranberry'
  ];
  items.forEach(text => {
    const div = document.createElement('div');
    div.textContent = text;
    fixture.appendChild(div);
  });
  fixture[symbols.itemsChanged]();
  return fixture;
}

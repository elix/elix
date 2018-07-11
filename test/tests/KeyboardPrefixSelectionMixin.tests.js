import * as symbols from '../../src/symbols.js';
import KeyboardPrefixSelectionMixin from '../../src/KeyboardPrefixSelectionMixin.js';
import ReactiveMixin from '../../src/ReactiveMixin.js';


const Base =
  KeyboardPrefixSelectionMixin(
  ReactiveMixin(
    HTMLElement
  ));

class KeyboardPrefixSelectionTest extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectedIndex: -1
    });
  }

  get items() {
    return this.state.items;
  }
  set items(items) {
    this.setState({ items });
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
    assert.equal(fixture.state.selectedIndex, 4);

    // Typing "l" moves to "Blackberry".
    fixture[symbols.keydown]({ keyCode: prefix.charCodeAt(1) });
    assert.equal(fixture.state.selectedIndex, 5);

    // Typing "u" moves to "Blueberry".
    fixture[symbols.keydown]({ keyCode: prefix.charCodeAt(2) });
    assert.equal(fixture.state.selectedIndex, 6);
  });

  it("backspace removes the last character added to the prefix", () => {
    const fixture = createSampleElement();
    const prefix = 'bl'; // The keys we'll simulate.

    // Typing "b" moves to "Banana".
    fixture[symbols.keydown]({ keyCode: prefix.charCodeAt(0) });
    assert.equal(fixture.state.selectedIndex, 4);

    // Typing "l" moves to "Blackberry".
    fixture[symbols.keydown]({ keyCode: prefix.charCodeAt(1) });
    assert.equal(fixture.state.selectedIndex, 5);

    // Typing Backspace moves back to "Banana".
    fixture[symbols.keydown]({ keyCode: 8 });
    assert.equal(fixture.state.selectedIndex, 4);
  });

  it("ignores typed keys that don't match", () => {
    const fixture = createSampleElement();
    // Typing "x" leaves selection alone (since it doesn't match).
    fixture[symbols.keydown]({ keyCode: 'x'.charCodeAt(0) });
    assert.equal(fixture.state.selectedIndex, -1);
  });

  it("handles spaces", () => {
    const fixture = createSampleElement();
    const prefix = 'e f'; // The keys we'll simulate.

    // Typing "e" moves to "E berry".
    fixture[symbols.keydown]({ keyCode: prefix.charCodeAt(0) });
    assert.equal(fixture.state.selectedIndex, 10);

    // Typing " " stays on "E berry".
    fixture[symbols.keydown]({ keyCode: prefix.charCodeAt(1) });
    assert.equal(fixture.state.selectedIndex, 10);

    // Typing "f" moves to "E fruit".
    fixture[symbols.keydown]({ keyCode: prefix.charCodeAt(2) });
    assert.equal(fixture.state.selectedIndex, 11);
  });

});


function createSampleElement() {
  const fixture = document.createElement('keyboard-prefix-selection-test');
  const texts = [
    'Acai',
    'Acerola',
    'Apple',
    'Apricot',
    'Banana',
    'Blackberry',
    'Blueberry',
    'Cantaloupe',
    'Cherry',
    'Cranberry',
    'E berry',
    'E fruit',
  ];
  const items = texts.map(text => {
    const div = document.createElement('div');
    div.textContent = text;
    return div;
  });
  fixture.items = items;
  return fixture;
}

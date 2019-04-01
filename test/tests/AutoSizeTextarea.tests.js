import '../../src/AutoSizeTextarea.js';
import flushPolyfills from '../flushPolyfills.js';


describe("AutoSizeTextarea", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("sets initial value from initial innerHTML", async () => {
    container.innerHTML = '<elix-auto-size-textarea>aardvark</elix-auto-size-textarea>';
    const fixture = container.querySelector('elix-auto-size-textarea');
    flushPolyfills();
    // Wait for slotchange event.
    await new Promise(resolve => setTimeout(resolve));
    assert.equal(fixture.value, 'aardvark');
  });

  it("applies its value to the inner textarea", () => {
    const fixture = document.createElement('elix-auto-size-textarea');
    fixture.value = 'beaver';
    fixture.render();
    flushPolyfills();
    assert(fixture.inner.value, 'beaver');
  });

  it("updates value when innerHTML changes", async () => {
    const fixture = document.createElement('elix-auto-size-textarea');
    container.appendChild(fixture);
    fixture.innerHTML = 'chihuahua';
    // Give content time to change.
    await Promise.resolve();
    assert.equal(fixture.value, 'chihuahua');
  });

  it("value property tracks content until value is directly set", async () => {
    const fixture = document.createElement('elix-auto-size-textarea');
    container.appendChild(fixture);
    assert(fixture.state.valueTracksContent);
    fixture.value = 'dingo';
    assert(!fixture.state.valueTracksContent);
    fixture.textContent = 'echidna';
    // Give content time to change.
    await Promise.resolve();
    assert(fixture.state.valueTracksContent);    
  });

  it("sets minimumRows to 1 by default", () => {
    const fixture = document.createElement('elix-auto-size-textarea');
    assert.equal(fixture.minimumRows, 1);
  });

  it("marshalls the minimum-rows attribute to the minimumRows property", () => {
    container.innerHTML = '<elix-auto-size-textarea minimum-rows="10"></elix-auto-size-textarea>';
    // flushPolyfills();
    const fixture = container.querySelector('elix-auto-size-textarea');
    assert.equal(fixture.minimumRows, 10);
  });

  it("autosizes to fit its contents", async () => {
    const fixture = document.createElement('elix-auto-size-textarea');
    container.appendChild(fixture);
    // flushPolyfills();
    const originalHeight = fixture.clientHeight;
    fixture.value = 'One\nTwo\nThree';
    // Height with three lines of text should be over twice as big.
    // flushPolyfills();
    await Promise.resolve();
    assert(fixture.clientHeight > originalHeight * 2);
  });

  it("applies minimumRows when text isn't tall enough", async () => {
    const fixture = document.createElement('elix-auto-size-textarea');
    container.appendChild(fixture);
    // flushPolyfills();
    // Original height should be sufficient to hold single line of text.
    const originalHeight = fixture.clientHeight;
    fixture.minimumRows = 3;
    await Promise.resolve();
    // flushPolyfills();
    // Height with minimumRows=3 should be over twice as big.
    assert(fixture.clientHeight > originalHeight * 2);
  });

  it("autosizes works when its text content is HTML", async () => {
    const fixture = document.createElement('elix-auto-size-textarea');
    container.appendChild(fixture);
    const originalHeight = fixture.clientHeight;
    fixture.value = `<html>\n<body>\n<p>\nThis is a test\n</p>\n<div>\nSome more tests\n</div>\n</body>\n</html>`;
    // flushPolyfills();
    await Promise.resolve();
    assert(fixture.clientHeight > originalHeight * 2);
  });

  it("autosizes works with text wrapping", async () => {
    const fixture = document.createElement('elix-auto-size-textarea');
    fixture.style.width = '400px';
    container.appendChild(fixture);
    const originalHeight = fixture.clientHeight;
    fixture.value = "Lots of words to force wrapping. Lots of words to force wrapping. Lots of words to force wrapping. Lots of words to force wrapping. Lots of words to force wrapping. Lots of words to force wrapping. Lots of words to force wrapping. Lots of words to force wrapping. Lots of words to force wrapping.";
    // flushPolyfills();
    await Promise.resolve();
    assert(fixture.clientHeight > originalHeight * 2);
  });

  it("autosizes works with long string with no whitespace", async () => {
    const fixture = document.createElement('elix-auto-size-textarea');
    fixture.style.width = '400px';
    container.appendChild(fixture);
    const originalHeight = fixture.clientHeight;
    fixture.value = "abcdefghijklmnopqrstuvwxyz.,;:+-abcdefghijklmnopqrstuvwxyz.,;:+-abcdefghijklmnopqrstuvwxyz.,;:+-abcdefghijklmnopqrstuvwxyz.,;:+-abcdefghijklmnopqrstuvwxyz.,;:+-abcdefghijklmnopqrstuvwxyz.,;:+-abcdefghijklmnopqrstuvwxyz.,;:+-abcdefghijklmnopqrstuvwxyz.,;:+-";
    // flushPolyfills();
    await Promise.resolve();
    assert(fixture.clientHeight > originalHeight * 2);
  });

  it("applies its placeholder property to the inner textarea", async () => {
    const fixture = document.createElement('elix-auto-size-textarea');
    container.appendChild(fixture);
    fixture.placeholder = 'Placeholder';
    // flushPolyfills();
    await Promise.resolve();
    assert.equal(fixture.inner.placeholder, 'Placeholder');
    assert.notEqual(fixture.value, 'Placeholder');
  });

});

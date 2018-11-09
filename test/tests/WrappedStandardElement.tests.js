import WrappedStandardElement from '../../src/WrappedStandardElement.js';


const WrappedA = WrappedStandardElement.wrap('a');
customElements.define('wrapped-a', WrappedA);

const WrappedButton = WrappedStandardElement.wrap('button');
customElements.define('wrapped-button', WrappedButton);

const WrappedDiv = WrappedStandardElement.wrap('div');
customElements.define('wrapped-div', WrappedDiv);

const WrappedImg = WrappedStandardElement.wrap('img');
customElements.define('wrapped-img', WrappedImg);

const WrappedInput = WrappedStandardElement.wrap('input');
customElements.define('wrapped-input', WrappedInput);


describe("WrappedStandardElement", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("creates an instance of the wrapped element", () => {
    const fixture = document.createElement('wrapped-a');
    fixture.render();
    assert(fixture.inner instanceof HTMLAnchorElement);
  });

  it("exposes getter/setters that proxy to the wrapped element", () => {
    const fixture = document.createElement('wrapped-a');
    fixture.href = 'http://localhost/foo/bar.html';
    container.appendChild(fixture);
    assert.equal(fixture.inner.href, 'http://localhost/foo/bar.html');
    assert.equal(fixture.protocol, 'http:');
    assert.equal(fixture.hostname, 'localhost');
    assert.equal(fixture.pathname, '/foo/bar.html');
  });

  it("marshals attributes to properties on the inner element", () => {
    const fixture = document.createElement('wrapped-a');
    container.appendChild(fixture);
    fixture.setAttribute('href', 'http://example.com/');
    fixture.render();
    assert.equal(fixture.inner.href, 'http://example.com/');
  });

  it("re-raises events not automatically retargetted by Shadow DOM", done => {
    const fixture = document.createElement('wrapped-img');
    container.appendChild(fixture);
    fixture.addEventListener('load', () => {
      done();
    });
    // Load a 1x1 pixel image to trigger the load event.
    fixture.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
  });

  it("does not raise events if inner element is disabled", () => {
    const fixture = document.createElement('wrapped-button');
    container.appendChild(fixture);
    let count = 0;
    fixture.addEventListener('click', () => {
      count++;
    });
    fixture.click();
    fixture.disabled = true;
    fixture.render();
    fixture.click();
    assert.equal(count, 1);
  });

  it("chooses an appropriate :host display style based on the wrapped element", () => {
    const fixtureA = document.createElement('wrapped-a');
    container.appendChild(fixtureA);
    const fixtureDiv = document.createElement('wrapped-div');
    container.appendChild(fixtureDiv);
    assert.equal(getComputedStyle(fixtureA).display, 'inline-block');
    assert.equal(getComputedStyle(fixtureDiv).display, 'block');
  });

  it("delegates boolean attributes", async () => {
    const fixture = document.createElement('wrapped-button');
    container.appendChild(fixture);
    
    // Disable via property.
    fixture.disabled = true;
    fixture.render();
    assert(fixture.inner.disabled);

    // Re-enable via property.
    fixture.disabled = false;
    fixture.render();
    assert(!fixture.inner.disabled);

    // Disable via attribute.
    fixture.setAttribute('disabled', '');
    fixture.render();
    assert(fixture.inner.disabled);
    
    // Re-enable via attribute.
    fixture.removeAttribute('disabled');    
    fixture.render();
    assert(!fixture.inner.disabled);
  });

  it("generates static observedAttributes property for attributes on the wrapped element", () => {
    const attributes = WrappedButton.observedAttributes;
    assert(attributes.indexOf('disabled') >= 0);
  });

  it("delegates methods", async () => {
    const fixture = new WrappedInput();
    fixture.value = "Hello";
    container.appendChild(fixture);
    fixture.setSelectionRange(1, 4);
    assert.equal(fixture.selectionStart, 1);
    assert.equal(fixture.selectionEnd, 4);
    fixture.focus();
    assert.equal(fixture.shadowRoot.activeElement, fixture.inner);
  });

});

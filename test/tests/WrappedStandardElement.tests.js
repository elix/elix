import WrappedStandardElement from '../../src/WrappedStandardElement.js';


const WrappedA = WrappedStandardElement.wrap('a');
customElements.define('wrapped-a', WrappedA);

const WrappedImg = WrappedStandardElement.wrap('img');
customElements.define('wrapped-img', WrappedImg);

const WrappedDiv = WrappedStandardElement.wrap('div');
customElements.define('wrapped-div', WrappedDiv);

const WrappedButton = WrappedStandardElement.wrap('button');
customElements.define('wrapped-button', WrappedButton);


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
    fixture.render();
    fixture.href = 'http://localhost/foo/bar.html';
    assert.equal(fixture.inner.href, 'http://localhost/foo/bar.html');
    assert.equal(fixture.protocol, 'http:');
    assert.equal(fixture.hostname, 'localhost');
    assert.equal(fixture.pathname, '/foo/bar.html');
  });

  it("marshals attributes to properties on the inner element", () => {
    const fixture = document.createElement('wrapped-a');
    fixture.render();
    fixture.setAttribute('href', 'http://example.com/');
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

  it("correctly handles delegated boolean attributes", () => {
    const fixture = document.createElement('wrapped-button');
    container.appendChild(fixture);
    fixture.disabled = true;
    assert(fixture.inner.disabled);
    fixture.disabled = false;
    assert(!fixture.inner.disabled);
    fixture.setAttribute('disabled', '');
    assert(fixture.inner.disabled);
    fixture.removeAttribute('disabled');    
    assert(!fixture.inner.disabled);
  });

  it("generates static observedAttributes property for attributes on the wrapped element", () => {
    const attributes = WrappedButton.observedAttributes;
    assert(attributes.indexOf('disabled') >= 0);
  });

});

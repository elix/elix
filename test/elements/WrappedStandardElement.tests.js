import WrappedStandardElement from '../../elements/WrappedStandardElement.js';


const WrappedA = WrappedStandardElement.wrap('a');
customElements.define('wrapped-a', WrappedA);

const WrappedImg = WrappedStandardElement.wrap('img');
customElements.define('wrapped-img', WrappedImg);

const WrappedDiv = WrappedStandardElement.wrap('div');
customElements.define('wrapped-div', WrappedDiv);


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
    fixture.addEventListener('load', event => {
      done();
    });
    // Load a 1x1 pixel image to trigger the load event.
    fixture.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
  });

  it("chooses an appropriate :host display style based on the wrapped element", () => {
    const fixtureA = document.createElement('wrapped-a');
    container.appendChild(fixtureA);
    const fixtureDiv = document.createElement('wrapped-div');
    container.appendChild(fixtureDiv);
    assert.equal(getComputedStyle(fixtureA).display, 'inline-block');
    assert.equal(getComputedStyle(fixtureDiv).display, 'block');
  });

});

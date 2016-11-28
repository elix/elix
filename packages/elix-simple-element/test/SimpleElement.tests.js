import { assert } from 'chai';
import SimpleElement from '../src/SimpleElement'; // jshint ignore:line


describe("SimpleElement", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("can be instantiated", () => {
    const fixture = document.createElement('elix-simple-element');
    container.appendChild(fixture);
    assert(fixture);
  });
});

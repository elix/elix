// import { merge } from '../../src/updates.js';
// import ReactiveElement from '../../src/ReactiveElement.js';
import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import ReactiveMixin from '../../src/ReactiveMixin.js';
import RenderUpdatesMixin from '../../src/RenderUpdatesMixin.js';
import RolesMixin from '../../src/RolesMixin.js';
import ShadowTemplateMixin from '../../src/ShadowTemplateMixin.js';


const Base =
  ReactiveMixin(
  RenderUpdatesMixin(
  RolesMixin(
  ShadowTemplateMixin(
    HTMLElement
  ))));

class DynamicRole extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      dynamicRole: 'button'
    });
  }

  [symbols.renderRoles](changes) {
    if (super[symbols.renderRoles]) { super[symbols.renderRoles](changes); }
    if (changes.dynamicRole) {
      this[symbols.renderNodeWithRole](this.$.dynamic, this.state.dynamicRole);
    }
  }

  get [symbols.template]() {
    return template.html`
      <div id="static">This doesn't change</div>
      <div id="dynamic">This element changes</div>
    `;
  }

}
customElements.define('dynamic-role', DynamicRole);


describe("RolesMixin", function () {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("instantiates initial role", async () => {
    const fixture = new DynamicRole();
    fixture.render();
    assert(fixture.$.static instanceof HTMLDivElement);
    assert(fixture.$.dynamic instanceof HTMLButtonElement);
    assert.equal(fixture.$.dynamic.getAttribute('id'), 'dynamic');
    assert.equal(fixture.$.dynamic.textContent, 'This element changes');
  });

  it("can change role after rendering", async () => {
    const fixture = new DynamicRole();
    fixture.render();
    assert(fixture.$.static instanceof HTMLDivElement);
    assert(fixture.$.dynamic instanceof HTMLButtonElement);
    fixture.setState({
      dynamicRole: 'a'
    });
    fixture.render();
    assert(fixture.$.dynamic instanceof HTMLAnchorElement);
    assert.equal(fixture.$.dynamic.getAttribute('id'), 'dynamic');
    assert.equal(fixture.$.dynamic.textContent, 'This element changes');
  });

});

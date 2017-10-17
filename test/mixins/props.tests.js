import * as props from '../../mixins/props.js';


describe("props helpers", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("props.get gets existing props from an element", () => {
    container.innerHTML = `
      <div class="foo bar" style="color: red;" aria-selected="false"></div>
    `;
    const fixture = container.children[0];
    const fixtureProps = props.get(fixture);
    assert.deepEqual(fixtureProps, {
      attributes: {
        'aria-selected': 'false'
      },
      classes: {
        bar: true,
        foo: true
      },
      style: {
        color: 'red'
      }
    });
  });

  it("props.apply merges new props on top of existing attributes", () => {
    container.innerHTML = `
      <div class="foo bar" style="color: red;" aria-selected="false"></div>
    `;
    const fixture = container.children[0];
    props.apply(fixture, {
      attributes: {
        'aria-selected': 'true'
      },
      classes: {
        foo: false,
        bletch: true
      },
      style: {
        color: 'green'
      }
    });
    assert.equal(fixture.getAttribute('aria-selected'), 'true');
    assert.equal(fixture.classList.value, 'bar bletch');
    assert.equal(fixture.style.color, 'green');
  });

  it("props.merge with no arguments returns an empty object", () => {
    const fixture = props.merge();
    assert.deepEqual(fixture, {});
  });

  it("props.merge merges multiple props dictionaries together", () => {
    const props1 = {
      attributes: {
        'aria-selected': 'false'
      },
      classes: {
        bar: true
      },
      style: {
        'background-color': 'gray',
        color: 'black'
      },
      customProperty0: 'Hello',
      customProperty1: 0
    };
    const props2 = {
      attributes: {
        'aria-selected': 'true'
      },
      classes: {
        foo: true
      },
      style: {
        color: 'red'
      },
      customProperty1: 1,
      customProperty2: true
    };
    const merged = props.merge(props1, props2);
    assert.equal(merged.attributes['aria-selected'], 'true');
    assert.deepEqual(merged.classes, { bar: true, foo: true });
    assert.equal(merged.style['background-color'], 'gray');
    assert.equal(merged.style.color, 'red');
    assert.equal(merged.customProperty0, 'Hello');
    assert.equal(merged.customProperty1, 1);
    assert.equal(merged.customProperty2, true);
  });

});

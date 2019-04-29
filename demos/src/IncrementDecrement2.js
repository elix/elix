import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import ReactiveElement2 from '../../src/ReactiveElement2.js';


class IncrementDecrement extends ReactiveElement2 {

  constructor() {
    super();
    // this.renderOnChange('value', state => {
    //   this.$.value.textContent = state.value;
    // });
    // this.renderOnChange('foo', state => {
    //   console.log(`foo is ${state.foo}`);
    // });
    // this.state.onChange('value', state => ({
    //   foo: state.value
    // }));
  }

  // TODO: Pass in changes to componentDidUpdate
  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.decrement.addEventListener('click', () => {
      this.value--;
    });
    this.$.increment.addEventListener('click', () => {
      this.value++;
    });
  }

  get defaultState() {
    const base = super.defaultState;
    Object.assign(base, {
      value: 0
    });
    // base.onChange('value', state => ({
    //   foo: state.value
    // }));
    return base;
  }

  [symbols.render](state, changed) {
    super[symbols.render](state, changed);
    if (changed.value) {
      this.$.value.textContent = state.value;
    }
    if (changed.foo) {
      console.log(`foo is ${state.foo}`);
    }
  }

  // Provide a public property that gets/sets state.
  get value() {
    return this.state.value;
  }
  set value(value) {
    this.setState({ value });
  }

  get [symbols.template]() {
    return template.html`
      <button id="decrement">-</button>
      <span id="value"></span>
      <button id="increment">+</button>
    `;
  }

}
customElements.define('increment-decrement', IncrementDecrement);


class CustomIncrementDecrement extends IncrementDecrement {
  // constructor() {
  //   super();
  //   this.renderOnChange('value', state => {
  //     this.$.value.style.color = state.value < 0 ? 'red' : null;
  //   });
  // }
  [symbols.render](state, changed) {
    super[symbols.render](state, changed);
    if (changed.value) {
      this.$.value.style.color = state.value < 0 ? 'red' : null;
    }
  }
}
customElements.define('custom-increment-decrement', CustomIncrementDecrement);

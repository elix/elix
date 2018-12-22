import State from '../../src/State.js';


describe("State", () => {

  it("runs an change handler when a state member changes", () => {
    // Simple machine just copies one value to another.
    const state = new State();
    state.onChange('text', state => {
      const callCount = state.callCount || 0;
      return {
        callCount: callCount + 1,
        parens: `(${state.text})`
      };
    });

    // With no `text` field, refinement is a no-op.
    state.set({ ignored: true });
    assert(state.text === undefined);
    assert(Object.keys(state).length === 1);

    // Setting text should invoke refiner.
    state.set({ text: 'Hello' });
    assert(state.text === 'Hello');
    assert(state.parens === '(Hello)');
    assert(state.callCount === 1);

    // Calling again with same text should not invoke refiner.
    state.set({ text: 'Hello' });
    assert(state.callCount === 1);
  });

  it("allows mutually-update change handlers", () => {
    const state = new State();
    // Convert text to number.
    state.onChange('text', state =>
      ({
        value: parseInt(state.text)
      })
    );
    // Convert number to text.
    state.onChange('value', state =>
      ({
        text: state.value.toString()
      })
    );

    state.set({ text: '1' });
    assert(state.text === '1');
    assert(state.value === 1);

    state.set({ value: 2 });
    assert(state.text === '2');
    assert(state.value === 2);
  });

  it("runs a change handler if any of its dependencies change", () => {
    // Machine that updates when either `a` or `b` changes.
    const state = new State();
    state.onChange(['a', 'b'], state =>
      ({
        aAndB: state.a && state.b,
        aOrB: state.a || state.b
      })
    );

    state.set({ a: true });
    assert(!state.aAndB);
    assert(state.aOrB);

    state.set({ b: true });
    assert(state.aAndB);
    assert(state.aOrB);
  });

  it("lets a change handler loop as long as necessary", () => {
    // Machine that updates a counter up to 10.
    const state = new State();
    state.onChange('value', state =>
      state.value < 10 ? { value: state.value + 1 } : null
    );

    state.set({ value: 1 });
    assert(state.value === 10);
  });

  it("doesn't run rules that don't apply", () => {
    let ranRule = false;

    // Machine with a rule that shouldn't run.
    const state = new State();
    state.onChange('b', () => {
      ranRule = true;
    });

    state.set({ a: 1 });
    assert(!ranRule);
  });

});

import { assert } from '../test-helpers.js';
import State from "../../src/State.js";

describe("State", () => {
  it("runs an change handler when a state member changes", () => {
    // Simple machine just copies one value to another.
    const state1 = new State();
    state1.onChange("text", state => {
      const callCount = state.callCount || 0;
      return {
        callCount: callCount + 1,
        parens: `(${state.text})`
      };
    });

    // With no `text` field, refinement is a no-op.
    const { state: state2 } = state1.copyWithChanges({ ignored: true });
    assert(state2.text === undefined);
    assert(Object.keys(state2).length === 1);

    // Setting text should invoke refiner.
    const { state: state3 } = state2.copyWithChanges({ text: "Hello" });
    assert(state3.text === "Hello");
    assert(state3.parens === "(Hello)");
    assert(state3.callCount === 1);

    // Calling again with same text should not invoke refiner.
    const { state: state4 } = state3.copyWithChanges({ text: "Hello" });
    assert(state4.callCount === 1);
  });

  it("allows mutually-updating change handlers", () => {
    const state1 = new State();
    // Convert text to number.
    state1.onChange("text", state => ({
      value: parseInt(state.text)
    }));
    // Convert number to text.
    state1.onChange("value", state => ({
      text: state.value.toString()
    }));

    const { state: state2 } = state1.copyWithChanges({ text: "1" });
    assert(state2.text === "1");
    assert(state2.value === 1);

    const { state: state3 } = state2.copyWithChanges({ value: 2 });
    assert(state3.text === "2");
    assert(state3.value === 2);
  });

  it("runs a change handler if any of its dependencies change", () => {
    // Machine that updates when either `a` or `b` changes.
    const state1 = new State();
    state1.onChange(["a", "b"], state => ({
      aAndB: state.a && state.b,
      aOrB: state.a || state.b
    }));

    const { state: state2 } = state1.copyWithChanges({ a: true });
    assert(!state2.aAndB);
    assert(state2.aOrB);

    const { state: state3 } = state2.copyWithChanges({ b: true });
    assert(state3.aAndB);
    assert(state3.aOrB);
  });

  it("lets a change handler loop as long as necessary", () => {
    // Machine that updates a counter up to 10.
    const state1 = new State();
    state1.onChange("value", state =>
      state.value < 10 ? { value: state.value + 1 } : null
    );

    const { state: state2 } = state1.copyWithChanges({ value: 1 });
    assert(state2.value === 10);
  });

  it("doesn't run rules that don't apply", () => {
    let ranRule = false;

    // Machine with a rule that shouldn't run.
    const state1 = new State();
    state1.onChange("b", () => {
      ranRule = true;
      return null;
    });

    state1.copyWithChanges({ a: 1 });
    assert(!ranRule);
  });
});

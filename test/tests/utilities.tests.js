import { stateChanged } from '../../src/utilities.js';


describe("utilities", () => {

  it("stateChanged reports changes in a state object", () => {

    // Object below lists the only changes we want to track.
    const stateChanges = {
      foo: null,
      bar: null
    };

    // For first state, everything changes.
    const state1 = {
      foo: 1,
      bar: true,
      bletch: 'Hello'
    };
    const changed1 = stateChanged(state1, stateChanges);
    assert(changed1.foo);
    assert(changed1.bar);
    assert(!changed1.bletch); // Not tracking that member.

    // Change just one member.
    const state2 = {
      foo: 2,
      bar: true,
      bletch: 'This change should be ignored'
    };
    const changed2 = stateChanged(state2, stateChanges);
    assert(changed2.foo);
    assert(!changed2.bar);

  });

});

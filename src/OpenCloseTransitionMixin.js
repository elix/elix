import Symbol from './Symbol.js';
import symbols from './symbols.js';


const expectedTransitionEndStateKey = Symbol('expectedTransitionEndState');
const transitionEndResolveKey = Symbol('transitionEndResolve');


export default function OpenCloseTransitionMixin(Base) {

  // The class prototype added by the mixin.
  class OpenCloseTransition extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      const elements = getTransitionElements(this);
      // We assume all transitions complete at the same time. We only listen to
      // transitioneend on the first element.
      elements[0].addEventListener('transitionend', () => {
        const expectedState = this[expectedTransitionEndStateKey];
        this[expectedTransitionEndStateKey] = null;
        if (this.state.visualState === expectedState) {
          const resolve = this[transitionEndResolveKey];
          this[transitionEndResolveKey] = null;
          if (resolve) {
            resolve();
          }
        }
      });
      this.transitionToNextVisualState();
    }

    componentDidUpdate() {
      if (super.componentDidUpdate) { super.componentDidUpdate(); }
      this.transitionToNextVisualState();
    }

    // This definition for closed is compatible with that in OverlayMixin,
    // so the two mixins can be used separately or together.
    get closed() {
      return this.state.visualState === this.visualStates.closed;
    }
    set closed(closed) {
      const parsed = String(closed) === 'true';
      const visualState = parsed ?
        this.visualStates.closed :
        this.visualStates.opened;
      this.setState({ visualState });
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        visualState: this.visualStates.closed
      });
    }

    // This definition for opened is compatible with that in OverlayMixin,
    // so the two mixins can be used separately or together.
    get opened() {
      return this.state.visualState === this.visualStates.opened;
    }
    set opened(opened) {
      const parsed = String(opened) === 'true';
      const visualState = parsed ?
        this.visualStates.opened :
        this.visualStates.closed;
      this.setState({ visualState });
    }
    
    async startClose() {
      if (this.opened) {
        await updateVisualState(this, this.visualStates.closing);
      }
    }

    async startOpen() {
      if (this.closed) {
        await updateVisualState(this, this.visualStates.opening);
      }
    }

    async transitionToNextVisualState() {
      let nextVisualState;
      switch (this.state.visualState) {
        case this.visualStates.opening:
          nextVisualState = this.visualStates.opened;
          break;

        case this.visualStates.closing:
          await this.whenTransitionEnds(this.visualStates.closing);
          nextVisualState = this.visualStates.closed;
          break;
      }
      if (nextVisualState) {
        await updateVisualState(this, nextVisualState);
      }
    }

    get visualStates() {
      return {
        closed: 'closed',
        closing: 'closing',
        opened: 'opened',
        opening: 'opening'
      };
    }

    whenTransitionEnds(expectedVisualState) {
      this[expectedTransitionEndStateKey] = expectedVisualState;
      return new Promise(resolve => {
        this[transitionEndResolveKey] = resolve;
      });
    }

  }

  return OpenCloseTransition;
}


function getTransitionElements(element) {
  return element[symbols.elementsWithTransitions] ?
    element[symbols.elementsWithTransitions]() :
    [element];
}


async function updateVisualState(element, visualState) {
  const changed = element.state.visualState !== visualState;
  if (changed) {
    await element.setState({ visualState });
    // A single invocation of a method like startOpen() will cause the
    // element to pass through multiple visual states. This makes it hard for
    // external hosts of this component to know what visual state the component
    // is in. Accordingly, we always raise an event if the visual state
    // has changed, even if symbols.raiseChangeEvents is false.
    const event = new CustomEvent('visual-state-changed', {
      detail: {
        visualState
      }
    });
    element.dispatchEvent(event);
  }
  return changed;
}

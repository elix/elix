import Symbol from './Symbol.js';
import symbols from './symbols.js';


export default function OpenCloseTransitionMixin(Base) {

  // The class prototype added by the mixin.
  class OpenCloseTransition extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      const elements = getTransitionElements(this);
      // We assume all transitions complete at the same time. We only listen to
      // transitioneend on the first element.
      elements[0].addEventListener('transitionend', () => {
        // console.log(`got transitionend ${this.state.visualState}, going to ${this[stateAfterTransitionKey]}`);
        const nextVisualState = this.state.stateAfterTransition;
        if (nextVisualState) {
          updateVisualState(this, nextVisualState, null);
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
        await updateVisualState(this, this.visualStates.beforeClose);
      }
    }

    async startOpen() {
      if (this.closed) {
        await updateVisualState(this, this.visualStates.beforeOpen);
      }
    }

    transitionToNextVisualState() {
      let nextVisualState;
      let stateAfterTransition;
      const visualStates = this.visualStates;
      // console.log(`transitioning from ${this.state.visualState}, ${this.style.opacity}`);
      switch (this.state.visualState) {

        case visualStates.beforeClose:
          nextVisualState = visualStates.closing;
          stateAfterTransition = visualStates.closed;
          break;
          
        case visualStates.beforeOpen:
          nextVisualState = visualStates.opening;
          stateAfterTransition = visualStates.opened;
          break;

      }
      // We read a layout property to force the browser to render the component
      // with its current styles before we move to the next state. This ensures
      // animated values will actually be applied before we move to the next
      // state.
      this.offsetHeight;
      if (nextVisualState) {
        // console.log(`${this.state.visualState} -> ${nextVisualState}, on transitionend will go to ${this[stateAfterTransitionKey]}`);
        updateVisualState(this, nextVisualState, stateAfterTransition);
      }
    }

    get visualStates() {
      return {
        beforeClose: 'beforeClose',
        beforeOpen: 'beforeOpen',
        closed: 'closed',
        closing: 'closing',
        opened: 'opened',
        opening: 'opening'
      };
    }
  }

  return OpenCloseTransition;
}


function getTransitionElements(element) {
  return element[symbols.elementsWithTransitions] ?
    element[symbols.elementsWithTransitions]() :
    [element];
}


async function updateVisualState(element, visualState, stateAfterTransition) {
  const changed = element.state.visualState !== visualState;
  if (changed) {
    await element.setState({
      visualState,
      stateAfterTransition
    });
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

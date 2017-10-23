import Symbol from '../mixins/Symbol.js';
import symbols from '../mixins/symbols.js';


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

    async startClose() {
      if (!this.closed) {
        await this.setState({ visualState: this.visualStates.collapsing });
      }
    }

    async startOpen() {
      if (!this.opened) {
        await this.setState({ visualState: this.visualStates.expanding });
      }
    }

    async transitionToNextVisualState() {
      let nextVisualState;
      switch (this.state.visualState) {
        case 'expanding':
          nextVisualState = 'opened';
          break;

        case 'collapsing':
          await this.whenTransitionEnds('collapsing');
          nextVisualState = 'closed';
          break;
      }
      if (nextVisualState) {
        this.setState({ visualState: nextVisualState });
      }
    }

    get visualStates() {
      return {
        closed: 'closed',
        collapsing: 'collapsing',
        expanding: 'expanding',
        opened: 'opened'
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

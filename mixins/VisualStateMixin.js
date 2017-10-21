import Symbol from '../mixins/Symbol.js';
import symbols from '../mixins/symbols.js';


const expectedTransitionEndStateKey = Symbol('expectedTransitionEndState');
const transitionEndResolveKey = Symbol('transitionEndResolve');


export default function VisualStateMixin(Base) {
  return class VisualState extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      const elements = getTransitionElements(this);
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

    whenTransitionEnds(visualState) {
      this[expectedTransitionEndStateKey] = visualState;
      return new Promise(resolve => {
        this[transitionEndResolveKey] = resolve;
      });
    }

  }
}


/* eslint-disable no-unused-vars */
function getTransitionElements(element) {
  return element[symbols.elementsWithTransitions] ?
    element[symbols.elementsWithTransitions]() :
    [element];
}

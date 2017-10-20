import Symbol from '../mixins/Symbol.js';
import symbols from '../mixins/symbols.js';


const transitionEndListenerKey = Symbol('transitionEndListener');


export default function VisualStateMixin(Base) {
  return class VisualState extends Base {

    constructor() {
      super();
      this[transitionEndListenerKey] = () => {
        transitionToNextVisualState(this, this.transitionEndTransitions);
      };
    }

    changeVisualState(visualState) {
      if (this.state.visualState !== visualState) {
        // if (this.props.onChangeVisualState) {
        //   // Controlled component
        //   this.props.onChangeVisualState(visualState);
        // } else {
          // Uncontrolled component
          this.setState({ visualState });
        // }
      }
    }

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      transitionToNextVisualState(this, this.immediateTransitions);
    }

    componentDidUpdate() {
      if (super.componentDidUpdate) { super.componentDidUpdate(); }
      transitionToNextVisualState(this, this.immediateTransitions);
    }

  }
}


/* eslint-disable no-unused-vars */
function getTransitionElements(element, visualState) {
  return element[symbols.elementsWithTransitions] ?
    element[symbols.elementsWithTransitions](visualState) :
    [element];
}


function transitionToNextVisualState(element, transitions) {
  const currentVisualState = element.state.visualState;
  getTransitionElements(element, currentVisualState).forEach(element => {
    element.removeEventListener('transitionend', element[transitionEndListenerKey]);
  });
  const nextVisualState = transitions && transitions[currentVisualState];
  getTransitionElements(element, nextVisualState).forEach(element => {
    element.addEventListener('transitionend', element[transitionEndListenerKey]);
  });
  if (nextVisualState) {
    element.changeVisualState(nextVisualState);
  }
}

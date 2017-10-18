import symbols from '../mixins/symbols.js';


export default function VisualStateMixin(Base) {
  return class VisualState extends Base {

    [symbols.shadowCreated]() {
      if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
      // const transitionEndHandler = (event) => {
        
      // }
      // getTransitionElements(this, effect).forEach(element => {
      //   element.addEventListener('transitionend', this[transitionendListenerKey]);
      // });
      // HACK
      this.$.content.addEventListener('transitionend', event => {
        transitionToNextVisualState(this, this.transitionEndTransitions);
      });
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


function getTransitionElements(element, effect) {
  return element[symbols.elementsWithTransitions] ?
    element[symbols.elementsWithTransitions](effect) :
    [element];
}


function transitionToNextVisualState(element, transitions) {
  const currentVisualState = element.state.visualState
  const nextVisualState = transitions && transitions[currentVisualState];
  if (nextVisualState) {
    element.changeVisualState(nextVisualState);
  }
}

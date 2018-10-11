/**
 * @module TransitionMixin
 */
export default function TransitionMixin(Base) {

 // The class prototype added by the mixin.
 class Transition extends Base {
  
  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }

    // Once everything's finished rendering, enable transition effects.
    setTimeout(() => {
      this.setState({
        enableTransitions: true
      });
    });
  }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        enableTransitions: false
      });
    }
  }

  return Transition;
}

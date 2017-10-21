

export default function ExpandCollapseMixin(Base) {

  // The class prototype added by the mixin.
  class ExpandCollapse extends Base {

    async collapse() {
      if (!this.closed) {
        await this.setState({ visualState: this.visualStates.collapsing });
      }
    }

    async expand() {
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

  }

  return ExpandCollapse;
}

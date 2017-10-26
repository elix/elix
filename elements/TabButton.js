import * as props from '../mixins/props.js';
import ElementBase from './ElementBase.js';
import FocusRingMixin from '../mixins/FocusRingMixin.js';
// import LanguageDirectionMixin from '../mixins/LanguageDirectionMixin';
import SlotContentMixin from '../mixins/SlotContentMixin.js';
import symbols from '../mixins/symbols.js';


const Base =
  FocusRingMixin(
  SlotContentMixin(
    ElementBase
  ));


/**
 * A classic rounded tab button.
 *
 * This component is used by [LabeledTabs](LabeledTabs), which will generate
 * an instance of `LabeledTabButton` for each panel in a set of tab panels.
 *
 * @extends HTMLElement
 */
class TabButton extends Base {

  get ariaSelected() {
    return this.state.selected;
  }
  set ariaSelected(selected) {
    this.setState({
      selected: String(selected) === 'true'
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      index: 0,
      selected: false,
      tabAlign: 'start',
      tabindex: '0',
      tabPosition: 'top'
    });
  }

  get index() {
    return this.state.index;
  }
  set index(index) {
    const selectedIndex = typeof index === 'string' ?
      parseInt(index) :
      index;
    this.setState({
      index: selectedIndex
    });
  }

  get props() {
    const base = super.props || {};
    const original = this.originalProps;

    // Host
    const stretch = this.state.tabAlign === 'stretch';
    const index = this.state.index;
    const needsSpacer = index > 0;
    const tabPosition = this.tabPosition;
    const needsLeftSpacer = needsSpacer &&
        (tabPosition === 'top' || tabPosition === 'bottom');
    const needsTopSpacer = needsSpacer &&
        (tabPosition === 'left' || tabPosition === 'right');
    
    // Button
    const positionStyles = {
      bottom: {
        'border-radius': '0 0 0.25em 0.25em',
        'margin-top': '-1px'
      },
      left: {
        'border-radius': '0.25em 0 0 0.25em',
        'margin-right': '-1px'
      },
      right: {
        'border-radius': '0 0.25em 0.25em 0',
        'margin-left': '-1px'
      },
      top: {
        'border-radius': '0.25em 0.25em 0 0',
        'margin-bottom': '-1px'
      }
    };
    const positionStyle = positionStyles[tabPosition];
    const selected = this.state.selected;
    const selectedStyle = {
      'opacity': 1,
      'z-index': 1
    };
    const borderStyle = {
      'border-top-color': null,
      'border-right-color': null,
      'border-left-color': null,
      'border-bottom-color': null
    };
    const borderSides = {
      'bottom': 'border-top-color',
      'left': 'border-right-color',
      'right': 'border-left-color',
      'top': 'border-bottom-color'
    };
    if (selected) {
      const borderSide = borderSides[tabPosition];
      borderStyle[borderSide] = 'transparent';
    }
    const buttonProps = {
      style: Object.assign(
        {
          'background-color': original.style && original.style['background-color'] || 'white',
        },
        positionStyle,
        borderStyle,
        selected && selectedStyle
      )
    };

    return props.merge(base, {
      attributes: {
        tabindex: original.attributes.tabindex || this.state.tabindex
      },
      style: {
        'flex': stretch ? 1 : original.style.flex,
        'margin-left': needsLeftSpacer ? '0.2em' : original.style['margin-left'],
        'margin-top': needsTopSpacer ? '0.2em' : original.style['margin-top'],
      },
      $: {
        button: buttonProps
      }
    });
  }

  get tabAlign() {
    return this.state.tabAlign;
  }
  set tabAlign(tabAlign) {
    this.setState({ tabAlign });
  }

  get tabPosition() {
    return this.state.tabPosition;
  }
  set tabPosition(tabPosition) {
    this.setState({ tabPosition });
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: inline-flex;
        }

        #button {
          background: inherit;
          border-color: #ccc;
          border-style: solid;
          border-width: 1px;
          color: inherit;
          flex: 1;
          font-family: inherit;
          font-size: inherit;
          margin: 0;
          outline: none;
          padding: 0.5em 0.75em;
          transition: border-color 0.25s;
          white-space: nowrap;
        }
      </style>
      <button id="button" tabindex="-1">
        <slot></slot>
      </button>
    `;
  }

}


customElements.define('elix-tab-button', TabButton);
export default TabButton;

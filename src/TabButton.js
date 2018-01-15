import { merge } from './updates.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';
import symbols from './symbols.js';
import WrappedStandardElement from './WrappedStandardElement.js';


const Base =
  FocusVisibleMixin(
  LanguageDirectionMixin(
  SlotContentMixin(
    WrappedStandardElement.wrap('button')
  )));


/**
 * A classic rounded tab button.
 *
 * This component is used by [Tabs](Tabs), which by default will generate an
 * instance of `TabButton` for each panel in a set of tab panels.
 *
 * @inherits WrappedStandardElement
 * @mixes FocusVisibleMixin
 * @mixes LanguageDirectionMixin
 * @mixes SlotContentMixin
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

  /**
   * The alignment of the tabs within the tab strip.
   * 
   * @type {('start'|'center'|'end'|'stretch')}
   * @default 'start'
   */
  get tabAlign() {
    return this.state.tabAlign;
  }
  set tabAlign(tabAlign) {
    this.setState({ tabAlign });
  }

  /**
   * The position of the tab strip with respect to the associated tab panels.
   * 
   * Setting this property does not actually change the tab buttons's position
   * in the document, but lets the tab button know how it should display itself.
   * The standard apperance of `TabButton` is to hide the visible border between
   * the tab button and its associated panel, and `tabPosition` is used to
   * determine which edge's border should be hidden.
   * 
   * @type {('bottom'|'left'|'right'|'top')}
   * @default 'top'
   */
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

        #inner {
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
      <button id="inner" tabindex="-1">
        <slot></slot>
      </button>
    `;
  }

  get updates() {
    const base = super.updates || {};
    const original = this.state.original;

    // Host
    const stretch = this.state.tabAlign === 'stretch';
    const index = this.state.index;
    const needsSpacer = index > 0;
    const tabPosition = this.tabPosition;
    const needsSideSpacer = needsSpacer &&
      (tabPosition === 'top' || tabPosition === 'bottom');
    const needsLeftSpacer = needsSideSpacer && !this.rightToLeft;
    const needsRightSpacer = needsSideSpacer && this.rightToLeft;
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
    /** @type {any} */
    const element = this;
    const color = element.disabled ?
      '#888' :
      base.style && base.style.color;
    const buttonProps = {
      style: Object.assign(
        {
          'background-color': original.style && original.style['background-color'] || 'white',
          color
        },
        positionStyle,
        borderStyle,
        selected && selectedStyle
      )
    };

    return merge(base, {
      attributes: {
        tabindex: original.attributes.tabindex || this.state.tabindex
      },
      style: {
        'flex': stretch ? 1 : original.style.flex,
        'margin-left': needsLeftSpacer ? '0.2em' : original.style['margin-left'],
        'margin-right': needsRightSpacer ? '0.2em' : original.style['margin-left'],
        'margin-top': needsTopSpacer ? '0.2em' : original.style['margin-top'],
      },
      $: {
        inner: buttonProps
      }
    });
  }

}


customElements.define('elix-tab-button', TabButton);
export default TabButton;

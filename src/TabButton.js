import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import Button from './Button.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';


const Base =
  FocusVisibleMixin(
  LanguageDirectionMixin(
  SlotContentMixin(
    Button
  )));


/**
 * Generic tab button with a text label
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
    return Object.assign(super.defaultState, {
      index: 0,
      overlapPanel: true,
      selected: false,
      tabAlign: 'start',
      tabindex: '0',
      treatEnterAsClick: false, // Let tab strip handle Enter.
      treatSpaceAsClick: false, // Let tab strip handle Space.
      position: 'top'
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
   * The position of the tab strip with respect to the associated tab panels.
   * 
   * Setting this property does not actually change the tab buttons's position
   * in the document, but lets the tab button know how it should display itself.
   * The standard apperance of `TabButton` is to hide the visible border between
   * the tab button and its associated panel, and `position` is used to
   * determine which edge's border should be hidden.
   * 
   * @type {('bottom'|'left'|'right'|'top')}
   * @default 'top'
   */
  get position() {
    return this.state.position;
  }
  set position(position) {
    this.setState({ position });
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

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, TabButton, symbols.template);
    const styleTemplate = template.html`
      <style>
        #inner {
          background: inherit;
          border-color: #ccc;
          border-style: solid;
          border-width: 1px;
          color: inherit;
          margin: 0;
          padding: 0.5em 0.75em;
          transition: border-color 0.25s;
          white-space: nowrap;
        }
      </style>
    `;
    result.content.appendChild(styleTemplate.content);
    return result;
  }

  get updates() {
    const base = super.updates || {};
    const {
      index,
      original,
      overlapPanel,
      position,
      selected,
      tabAlign,
      tabindex
    } = this.state;

    // Host
    const stretch = tabAlign === 'stretch';
    const needsSpacer = index > 0;
    const needsSideSpacer = needsSpacer &&
      (position === 'top' || position === 'bottom');
    const needsLeftSpacer = needsSideSpacer && !this[symbols.rightToLeft];
    const needsRightSpacer = needsSideSpacer && this[symbols.rightToLeft];
    const needsTopSpacer = needsSpacer &&
      (position === 'left' || position === 'right');
    const hostStyle = {
      flex: stretch ? 1 : original.style.flex
    };
    // Spread out tabs
    hostStyle['margin-left'] = needsLeftSpacer ? '0.2em' : '';
    hostStyle['margin-right'] = needsRightSpacer ? '0.2em' : '';
    hostStyle['margin-top'] = needsTopSpacer ? '0.2em' : '';
    if (overlapPanel) {
      // Offset host so that it overlaps with tab panel.
      const marginStylesForPosition = {
        bottom: {
          'margin-top': '-1px'
        },
        left: {
          'margin-right': '-1px'
        },
        right: {
          'margin-left': '-1px'
        },
        top: {
          'margin-bottom': '-1px'
        }
      };
      Object.assign(hostStyle, marginStylesForPosition[position]);
    }

    // Button
    const buttonStyle = {
      'border-top-color': null,
      'border-right-color': null,
      'border-left-color': null,
      'border-bottom-color': null
    };
    const borderRadiusForPosition = {
      bottom: '0 0 0.25em 0.25em',
      left: '0.25em 0 0 0.25em',
      right: '0 0.25em 0.25em 0',
      top: '0.25em 0.25em 0 0'
    };
    buttonStyle.borderRadius = borderRadiusForPosition[position];
    buttonStyle['z-index'] = selected ? '1' : '';
    const borderSides = {
      'bottom': 'border-top-color',
      'left': 'border-right-color',
      'right': 'border-left-color',
      'top': 'border-bottom-color'
    };
    if (selected) {
      const borderSide = borderSides[position];
      buttonStyle[borderSide] = 'transparent';
    }
    /** @type {any} */
    const element = this;
    buttonStyle.color = element.disabled ?
      '#888' :
      base.style && base.style.color;
    const originalBackgroundColor = original.style && original.style['background-color'];
    buttonStyle['background-color'] = originalBackgroundColor || 'white';

    return merge(base, {
      attributes: {
        tabindex: original.attributes.tabindex || tabindex
      },
      style: hostStyle,
      $: {
        inner: {
          style: buttonStyle
        }
      }
    });
  }

}


customElements.define('elix-tab-button', TabButton);
export default TabButton;

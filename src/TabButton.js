import * as symbols from './symbols.js';
import * as template from './template.js';
import Button from './Button.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import GenericMixin from './GenericMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';


const Base =
  FocusVisibleMixin(
  GenericMixin(
  LanguageDirectionMixin(
  SlotContentMixin(
    Button
  ))));


/**
 * Generic tab button with a text label
 *
 * This component is used by [Tabs](Tabs), which by default will generate an
 * instance of `TabButton` for each panel in a set of tab panels.
 *
 * @inherits WrappedStandardElement
 * @mixes FocusVisibleMixin
 * @mixes GenericMixin
 * @mixes LanguageDirectionMixin
 * @mixes SlotContentMixin
 */
class TabButton extends Base {

  get defaultState() {
    return Object.assign(super.defaultState, {
      selected: false,
      treatEnterAsClick: false, // Let tab strip handle Enter.
      treatSpaceAsClick: false, // Let tab strip handle Space.
      position: 'top'
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

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.generic) {
      this.$.inner.classList.toggle('generic', this.state.generic);
    }
    if (changed.generic || changed.position) {
      // Adjust margins.
      const { generic, position } = this.state;
      const margins = generic ?
        {
          marginBottom: position === 'top' ? '-1px' : null,
          marginLeft: position === 'right' ? '-1px' : null,
          marginRight: position === 'left' ? '-1px' : null,
          marginTop: position === 'bottom' ? '-1px' : null
        } :
        {
          marginBottom: null,
          marginLeft: null,
          marginRight: null,
          marginTop: null
        };
      Object.assign(this.style, margins);

      // Adjust which corners are rounded.
      const borderRadiusForPosition = {
        bottom: '0 0 0.25em 0.25em',
        left: '0.25em 0 0 0.25em',
        right: '0 0.25em 0.25em 0',
        top: '0.25em 0.25em 0 0'
      };
      this.$.inner.style.borderRadius = generic ?
        borderRadiusForPosition[position] :
        null;
    }
    if (changed.generic || changed.position || changed.selected) {
      // Adjust selected appearance.
      const { generic, position, selected } = this.state;
      const buttonStyle = {
        borderBottomColor: null,
        borderLeftColor: null,
        borderRightColor: null,
        borderTopColor: null,
        zIndex: selected ? '1' : ''
      };
      if (generic && selected) {
        // We style the border opposite the button's position: if the button is
        // on the left, we style the right border, and so on.
        const borderColorSideForPosition = {
          'bottom': 'borderTopColor',
          'left': 'borderRightColor',
          'right': 'borderLeftColor',
          'top': 'borderBottomColor'
        };
        const borderSide = borderColorSideForPosition[position];
        buttonStyle[borderSide] = 'transparent';
      }
      Object.assign(this.inner.style, buttonStyle);
    }
  }

  get selected() {
    return this.state.selected;
  }
  set selected(selected) {
    this.setState({
      selected
    });
  }

  get [symbols.template]() {
    return template.concat(super[symbols.template], template.html`
      <style>
        #inner {
          background: inherit;
          color: inherit;
          margin: 0;
        }

        #inner.generic {
          background: white;
          border-color: #ccc;
          border-style: solid;
          border-width: 1px;
          padding: 0.5em 0.75em;
          white-space: nowrap;
        }

        :host(.selected) #inner.generic {
          z-index: 1;
        }

        #inner.generic:disabled {
          color: #888;
        }
      </style>
    `);
  }

}


customElements.define('elix-tab-button', TabButton);
export default TabButton;

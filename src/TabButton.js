import { getSuperProperty } from './workarounds.js';
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
      treatEnterAsClick: false, // Let tab strip handle Enter.
      treatSpaceAsClick: false, // Let tab strip handle Space.
      position: 'top'
    });
  }

  get index() {
    return this.state.index;
  }
  set index(index) {
    const parsed = Number(index);
    if (!isNaN(parsed)) {
      this.setState({
        index: parsed
      });
    }
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

  [symbols.render](state, changed) {
    super[symbols.render](state, changed);
    if (changed.index || changed.languageDirection ||
        changed.overlapPanel || changed.position) {
      // Adjust margins.
      const { index, languageDirection, overlapPanel, position } = state;
      const rightToLeft = languageDirection === 'rtl';
      const needsSpacer = index > 0;
      const needsSideSpacer = needsSpacer &&
        (position === 'top' || position === 'bottom');
      const needsLeftSpacer = needsSideSpacer && !rightToLeft;
      const needsRightSpacer = needsSideSpacer && rightToLeft;
      const needsTopSpacer = needsSpacer &&
        (position === 'left' || position === 'right');
      const margins = {
        marginBottom: '',
        marginLeft: needsLeftSpacer ? '0.2em' : '',
        marginRight: needsRightSpacer ? '0.2em' : '',
        marginTop: needsTopSpacer ? '0.2em' : ''
      };
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
        Object.assign(margins, marginStylesForPosition[position]);
      }
      Object.assign(this.style, margins);
    }
    if (changed.position) {
      // Adjust which corners are rounded.
      const { position } = state;
      const borderRadiusForPosition = {
        bottom: '0 0 0.25em 0.25em',
        left: '0.25em 0 0 0.25em',
        right: '0 0.25em 0.25em 0',
        top: '0.25em 0.25em 0 0'
      };
      this.$.inner.style.borderRadius = borderRadiusForPosition[position];
    }
    if (changed.position || changed.selected) {
      // Adjust selected appearance.
      const { position, selected } = state;
      const buttonStyle = {
        borderBottomColor: null,
        borderLeftColor: null,
        borderRightColor: null,
        borderTopColor: null,
        zIndex: selected ? '1' : ''
      };
      if (selected) {
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
      Object.assign(this.$.inner.style, buttonStyle);
    }
    if (changed.innerProperties || changed.original) {
      // Adjust colors.
      const { innerProperties, original } = state;
      const originalColor = original.style && original.style.color;
      const originalBackgroundColor = original.style && original.style['background-color'];
      const disabled = innerProperties.disabled;
      Object.assign(this.$.inner.style, {
        color: disabled ? '#888' : originalColor,
        backgroundColor: originalBackgroundColor || 'white'
      });
    }
    if (changed.tabAlign) {
      // Stretch tabs if necessary for tab alignment.
      const { tabAlign } = state;
      const stretch = tabAlign === 'stretch';
      this.style.flex = stretch ? '1' : null;
    }
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
    // Next line is same as: const base = super[symbols.template]
    const base = getSuperProperty(this, TabButton, symbols.template);
    return template.concat(base, template.html`
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
    `);
  }

}


customElements.define('elix-tab-button', TabButton);
export default TabButton;

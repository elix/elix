import { html } from './template.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import SlotContentMixin from './SlotContentMixin.js';
import WrappedStandardElement from './WrappedStandardElement.js';


const Base = 
  SlotContentMixin(
    WrappedStandardElement.wrap('textarea')
  );


/**
 * A text area that makes itself big enough to show its content.
 * 
 * [This text area grows as you add text](/demos/autosizeTextarea.html)
 *
 * This text input component is useful in situations where you want to ask the
 * user to enter as much text as they want, but don't want to take up a lot of
 * room on the page.
 * 
 * *Note:* This component uses [WrappedStandardElement](WrappedStandardElement)
 * to wrap a standard `<textarea>` element. This allows it to provide all
 * standard `HTMLTextAreaElement` properties, methods, and events, in addition
 * to those specifically listed in the `AutosizeTextarea` API.
 *
 * @inherits WrappedStandardElement
 * @mixes SlotContentMixin
 */
class AutosizeTextarea extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }

    this[symbols.contentSlot].addEventListener('slotchange', () => {
      this.setState({ valueTracksContent: true });
    });

    this.$.inner.addEventListener('input', () => {
      this[symbols.raiseChangeEvents] = true;
      this.setState({ valueTracksContent: false });
      /** @type {any} */
      const inner = this.$.inner;
      this.setState({
        value: inner.value
      });
      this[symbols.raiseChangeEvents] = false;
    });

    // For auto-sizing to work, we need the text copy to have the same border,
    // padding, and other relevant characteristics as the original text area.
    // Since those aspects are affected by CSS, we have to wait until the
    // element is in the document before we can update the text copy.
    const textareaStyle = getComputedStyle(this.$.inner);
    const lineHeight = this.$.extraSpace.clientHeight;
    this.setState({
      copyStyle: {
        'border-bottom-style': textareaStyle.borderBottomStyle,
        'border-bottom-width': textareaStyle.borderBottomWidth,
        'border-left-style': textareaStyle.borderLeftStyle,
        'border-left-width': textareaStyle.borderLeftWidth,
        'border-right-style': textareaStyle.borderRightStyle,
        'border-right-width': textareaStyle.borderRightWidth,
        'border-top-style': textareaStyle.borderTopStyle,
        'border-top-width': textareaStyle.borderTopWidth,
        'padding-bottom': textareaStyle.paddingBottom,
        'padding-left': textareaStyle.paddingLeft,
        'padding-right': textareaStyle.paddingRight,
        'padding-top': textareaStyle.paddingTop
      },
      lineHeight
    });
  }

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }

    // See if value changed, taking into account the possibility that value
    // may be calculated from content, or set directly.
    const value = this.value;
    const changed = this.state.valueTracksContent ?
      value !== getTextFromContent(previousState.content) :
      value !== previousState.value;
    if (changed && this[symbols.raiseChangeEvents]) {
      const event = new CustomEvent('value-changed', {
        detail: { value }
      });
      this.dispatchEvent(event);
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      minimumRows: 1,
      value: null,
      valueTracksContent: true
    });
  }

  /**
   * Determines the minimum number of rows shown. This is similar to the rows
   * attribute on a standard textarea, but because this element can grow, is
   * expressed as a minimum rather than a fixed number.
   *
   * By default, this property is 1, so when empty, the text area will be a
   * single line tall. That's efficient in terms of the space it consumes, but
   * until the user interacts with the element, they may not realize they can
   * enter multiple lines of text. Setting the property to a value higher than 1
   * will signal to the user that they can enter multiple lines of a text.
   *
   * By setting this property, you can also communicate to the user some sense
   * of how much text you're expecting them to provide. For example, on a
   * feedback form, asking the user to enter their feedback in a single-line
   * text box implies you don't really want them to enter much text — even if
   * the text box will grow when they type. By setting this to a value like,
   * say, 10 rows, you can signal that you're fully expecting them to enter more
   * text.
   *
   * @type {number}
   * @default 1
   */
  get minimumRows() {
    return this.state.minimumRows;
  }
  set minimumRows(minimumRows) {
    const parsed = parseInt(minimumRows);
    this.setState({
      minimumRows: parsed
    });
  }
  
  /*
   * Things to note about this component's DOM structure:
   *
   * * The component works by copying the text to an invisible element which
   *   will automatically grow in size; the expanding copy will expand the
   *   container, which in turn will vertically stretch the text area to match.
   *
   * * The invisible copyContainer contains an extra space element that ensures
   *   that, even if the last line of the textarea is blank, there will be
   *   something in the line that forces the text copy to grow by a line.
   *
   * * The inner text element has box-sizing: border-box, but the copy has
   *   content-box. The latter makes it easier for us to set the minimum height
   *   of the copy by just setting the height of the content, without having to
   *   account for borders and padding.
   *
   * * We put the slot inside an element that's hidden. This gives us easy
   *   access to assigned content so we can copy into the textarea, while
   *   ensuring the original content doesn't show up directly.
   */
  get [symbols.template]() {
    return html`
      <style>
        :host {
          display: block;
        }

        #autoSizeContainer {
          position: relative;
        }

        #inner,
        #copyContainer {
          font-family: inherit;
          font-size: inherit;
          font-style: inherit;
          font-weight: inherit;
          line-height: inherit;
          margin: 0;
        }

        #inner {
          box-sizing: border-box;
          height: 100%;
          overflow: hidden;
          position: absolute;
          resize: none;
          top: 0;
          width: 100%;
        }

        #copyContainer {
          box-sizing: content-box;
          visibility: hidden;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        #extraSpace {
          display: inline-block;
          width: 0;
        }
      </style>
      <div id="autoSizeContainer">
        <textarea id="inner"></textarea>
        <div id="copyContainer"><span id="textCopy"></span><span id="extraSpace">&nbsp;</span></div>
      </div>
      <div hidden>
        <slot></slot>
      </div>
    `;
  }

  get updates() {

    const value = this.value;

    let copyStyle = this.state.copyStyle;
    if (copyStyle) {
      const minHeight = this.state.minimumRows * this.state.lineHeight;
      copyStyle = Object.assign({}, copyStyle, {
        'min-height': `${minHeight}px`
      });
    }

    return merge(super.updates, {
      $: {
        copyContainer: {
          style: copyStyle
        },
        inner: {
          value
        },
        textCopy: {
          textContent: value
        }
      }
    });
  }

  /**
   * The text currently shown in the textarea.
   *
   * Note that the text shown in the textarea can also be updated by changing
   * the element's innerHTML/textContent. However, if the value property is
   * explicitly set, that will override the innerHTML/textContent.
   *
   * @type {string}
   */
  get value() {
    return this.state.valueTracksContent ?
      getTextFromContent(this.state.content) :
      this.state.value;
  }
  set value(value) {
    this.setState({
      value,
      valueTracksContent: false
    });
  }
}


// Return the text represented by the given content nodes.
function getTextFromContent(contentNodes) {
  if (contentNodes === null) {
    return '';
  }
  const texts = [...contentNodes].map(node => node.textContent);
  const text = texts.join('').trim();
  return unescapeHtml(text);
}


function unescapeHtml(html) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, '\'');
}



customElements.define('elix-autosize-textarea', AutosizeTextarea);
export default AutosizeTextarea;

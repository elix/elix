import * as symbols from './symbols.js';
import * as template from './template.js';
import SlotContentMixin from './SlotContentMixin.js';
import WrappedStandardElement from './WrappedStandardElement.js';


const Base = 
  SlotContentMixin(
    WrappedStandardElement.wrap('textarea')
  );


/**
 * Text area that grows to accommodate its content
 * 
 * [This text area grows as you add text](/demos/autoSizeTextarea.html)
 *
 * This text input component is useful in situations where you want to ask the
 * user to enter as much text as they want, but don't want to take up a lot of
 * room on the page.
 * 
 * *Note:* This component uses [WrappedStandardElement](WrappedStandardElement)
 * to wrap a standard `<textarea>` element. This allows it to provide all
 * standard `HTMLTextAreaElement` properties, methods, and events, in addition
 * to those specifically listed in the `AutoSizeTextarea` API.
 *
 * @inherits WrappedStandardElement
 * @mixes SlotContentMixin
 */
class AutoSizeTextarea extends Base {

  componentDidMount() {
    super.componentDidMount();

    // The following jsDoc comment doesn't directly apply to the statement which
    // follows, but is placed there because the comment has to go somewhere to
    // be visible to jsDoc, and the statement is at tangentially related.
    /**
     * Raised when the user changes the element's text content.
     * 
     * This is the standard `input` event; the component does not do any work to
     * raise it. It is documented here to let people know it is available to
     * detect when the user edits the content.
     * 
     * @event input
     */
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

  get defaultState() {
    const state = Object.assign(super.defaultState, {
      minimumRows: 1,
      value: null,
      valueTracksContent: true
    });

    state.onChange(['content', 'valueTracksContent'], (state, changed) => {
      if ((changed.content || changed.valueTracksContent)
          && state.valueTracksContent) {
        const value = getTextFromContent(state.content);
        return {
          value
        };
      }
      return null;
    });

    return state;
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
    const parsed = Number(minimumRows);
    if (!isNaN(parsed)) {
      this.setState({
        minimumRows: parsed
      });
    }
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    const { copyStyle, lineHeight, minimumRows, value } = this.state;
    if (changed.copyStyle) {
      Object.assign(this.$.copyContainer.style, copyStyle);
    }
    if (changed.lineHeight || changed.minimumRows && lineHeight != null) {
      const minHeight = minimumRows * lineHeight;
      this.$.copyContainer.style.minHeight = `${minHeight}px`;
    }
    if (changed.value) {
      /** @type {HTMLTextAreaElement} */ (this.$.inner).value = value;
      this.$.textCopy.textContent = value;
    }
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
    return template.html`
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
    return this.state.value;
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



customElements.define('elix-auto-size-textarea', AutoSizeTextarea);
export default AutoSizeTextarea;

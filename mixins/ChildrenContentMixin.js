import Symbol from './Symbol.js';
import symbols from './symbols.js';


const initialContentObserverKey = Symbol('initialContentObserver');
const initialContentTimeoutKey = Symbol('initialContentTimeout');


/**
 * Define a component's content as its light DOM children.
 */
// TODO: innerText, outerHTML, querySelector, querySelectorAll
export default function ChildrenContentMixin(Base) {
  return class ChildrenContent extends Base {

    appendChild(child) {
      if (this[symbols.rendering]) {
        return super.appendChild(child);
      } else {
        // console.log(`appendChild ${child}`);
        const content = [...this.state.content, child];
        this.setState({ content });
        return child;
      }
    }

    get childNodes() {
      if (this[symbols.rendering]) {
        return super.childNodes;
      } else {
        return this.state.content.slice();
      }
    }

    get children() {
      if (this[symbols.rendering]) {
        return super.children;
      } else {
        const elements = this.state.content.filter(item => item instanceof Element);
        return elements;
      }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      // console.log(`connectedCallback: ${this.childNodes.length}`);
      if (this.state.content === null) {
        // First call to connectedCallback.
        if (super.childNodes.length === 0) {
          // The document may still be parsing.

          this[initialContentObserverKey] = new MutationObserver(() => {
            // console.log(`MutationObserver: ${this.childNodes.length}`);
            extractInitialContent(this);
          });
          this[initialContentObserverKey].observe(this, { childList: true });

          this[initialContentTimeoutKey] = setTimeout(() => {
            // console.log(`timeout: ${this.childNodes.length}`);
            extractInitialContent(this);
          });
        } else {
          // Already have children.
          extractInitialContent(this);
        }
      }
    }

    contains(child) {
      if (this[symbols.rendering]) {
        return super.contains(child);
      } else {
        return this.state.content && this.state.content.indexOf(child) >= 0;
      }
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        content: null
      });
    }

    get firstChild() {
      if (this[symbols.rendering]) {
        return super.firstChild;
      } else {
        const child = this.state.content && this.state.content[0];
        return child;
      }
    }

    hasChildNodes() {
      if (this[symbols.rendering]) {
        return super.hasChildNodes();
      } else {
        return this.state.content && this.state.content.length > 0;
      }
    }

    get innerHTML() {
      if (this[symbols.rendering]) {
        return super.innerHTML;
      } else {
        const strings = this.state.content.map(o =>
          o instanceof Element ?
            o.outerHTML :
            o instanceof Text ?
              o.textContent :
              o.toString()
        );
        return strings.join('');
      }
    }
    set innerHTML(html) {
      if (this[symbols.rendering]) {
        super.innerHTML = html;
      } else {
        const template = document.createElement('template');
        template.innerHTML = html;
        const content = [...template.content.childNodes];
        // console.log(`set innerHTML = ${content}`);
        this.setState({ content });
      }
    }

    insertBefore(newNode, referenceNode) {
      if (this[symbols.rendering]) {
        return super.insertBefore(newNode, referenceNode);
      } else {
        const content = this.state.content;
        const index = referenceNode ?
          content.indexOf(referenceNode) :
          content.length;
        if (index >= 0) {
          const content = content.slice();
          content.splice(index, 0, newNode);
          this.setState({ content });
        } else {
          throw 'Exception: The node before which the new node is to be inserted is not a child of this node.';
        }
        return newNode;
      }
    }

    get lastChild() {
      if (this[symbols.rendering]) {
        return super.lastChild;
      } else {
        const content = this.state.content;
        const child = content && content.length > 0 ?
          content[content.length - 1] :
          null;
        return child;
      }
    }

    removeChild(child) {
      if (this[symbols.rendering]) {
        return super.removeChild(child);
      } else {
        const index = this.state.content.indexOf(child);
        if (index >= 0) {
          const content = this.state.content.slice();
          content.splice(index, 1);
          this.setState({ content });
        }
        return child;
      }
    }

    replaceChild(newChild, oldChild) {
      if (this[symbols.rendering]) {
        return super.replaceChild(newChild, oldChild);
      } else {
        const index = this.state.content.indexOf(oldChild);
        if (index >= 0) {
          const content = this.state.content.slice();
          content[index] = newChild;
          this.setState({ content });
        }
        return oldChild;
      }
    }

    renderContent() {
      return this.state.content;
      // return html`${this.state.content}`;
      // return html`${repeat(this.state.content, item => item)}`;
    }

    get textContent() {
      if (this[symbols.rendering]) {
        return super.textContent;
      } else {
        const strings = this.state.content.map(o =>
          o instanceof Node ? o.textContent : o.toString()
        );
        return strings.join('');
      }
    }
    set textContent(textContent) {
      if (this[symbols.rendering]) {
        super.textContent = textContent;
      } else {
        const content = textContent == null ?
          [] :
          [document.createTextNode(textContent)];
        // console.log(`set textContent = ${content}`);
        this.setState({ content });
      }
    }

  }
}


function extractInitialContent(component) {

  // console.log(`extractInitialContent`);

  // Stop waiting for any pending notifications.
  if (component[initialContentObserverKey]) {
    component[initialContentObserverKey].disconnect();
    component[initialContentObserverKey] = null;
  }
  if (component[initialContentTimeoutKey]) {
    clearTimeout(component[initialContentTimeoutKey]);
    component[initialContentTimeoutKey] = null;
  }

  // Extract any initial light DOM children as content.
  const content = [];
  const rendering = component[symbols.rendering];
  component[symbols.rendering] = true;
  while (component.childNodes.length > 0) {
    content.push(component.childNodes[0]);
    component.removeChild(component.childNodes[0]);
  }
  component[symbols.rendering] = rendering;

  // Set the content as state, triggering a render. That will typically render
  // the content into some new position in the light DOM.
  component.setState({ content });
}

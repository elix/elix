import {
  defaultState,
  firstRender,
  ids,
  raiseChangeEvents,
  render,
  setState,
  state,
  stateEffects,
  template,
} from "../../src/base/internal.js";
import SlotContentMixin from "../../src/base/SlotContentMixin.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

/**
 * Lightweight demo/story browser
 */
export default class StoryBrowser extends SlotContentMixin(ReactiveElement) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      defaultPath: null,
      links: [],
      path: getPathFromHash(window.location.hash),
    });
  }

  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      // Clicking close button navigates to current page (without frame).
      this[ids].closeButton.addEventListener("click", () => {
        this[raiseChangeEvents] = true;
        window.location = this[state].path;
        this[raiseChangeEvents] = false;
      });

      // Refresh title on page load.
      this[ids].frame.addEventListener("load", () => {
        document.title = this[ids].frame.contentDocument.title;
      });

      // When hash changes, load the indicated page.
      window.addEventListener("hashchange", () => {
        this[raiseChangeEvents] = true;
        const path =
          getPathFromHash(window.location.hash) || this[state].defaultPath;
        this[setState]({ path });
        this[raiseChangeEvents] = false;
      });
    }

    if (changed.path) {
      const { path } = this[state];
      // Show the indicated story in the frame.
      if (this[ids].frame.contentDocument.location.pathname !== path) {
        // Use `replace` to avoid affecting browser history.
        this[ids].frame.contentWindow.location.replace(path);
      }
    }

    // Highlight any navigation links that point to this page.
    if (changed.links || changed.path) {
      const { links, path } = this[state];
      let currentLink;
      if (links && path) {
        // Mark any links which are current.
        const expectedHash = `#path=${path}`;
        links.forEach((link) => {
          const current = link.hash === expectedHash;
          link.classList.toggle("current", current);
          if (current && !currentLink) {
            currentLink = link;
          }
        });
        // Scroll the (first) current link into view.
        if (currentLink) {
          currentLink.scrollIntoView({ block: "nearest" });
        }
      }
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects]
      ? super[stateEffects](state, changed)
      : {};

    // Extract links from content.
    if (changed.content && state.content) {
      const links = [];
      state.content.forEach((element) => {
        if (element instanceof HTMLAnchorElement) {
          // Content element is itself a link.
          links.push(element);
        }
        if (element instanceof HTMLElement) {
          // Add any links inside content element
          links.push(...element.querySelectorAll("a"));
        }
      });
      Object.assign(effects, { links });
    }

    // Use first link as default path.
    if (changed.links && state.links.length > 0) {
      const defaultPath = getPathFromHash(state.links[0].hash);
      Object.assign(effects, { defaultPath });
    }

    // Use the default path as a path if we don't have a path already.
    if (changed.defaultPath && state.defaultPath && !state.path) {
      Object.assign(effects, {
        path: state.defaultPath,
      });
    }

    return effects;
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: grid;
          grid-template-columns: auto 1fr;
          overflow: hidden;
        }

        [part~="navigation"] {
          position: relative;
          overflow: auto;
        }

        #toolbar {
          display: grid;
          position: sticky;
          top: 0;
          width: 100%;
        }

        #closeButton {
          background: none;
          border: none;
          color: inherit;
          margin: 0.5em;
          position: absolute;
          right: 0;
        }

        [part~="frame"] {
          border: none;
          height: 100%;
          position: relative;
          width: 100%;
        }
      </style>
      <nav id="navigation" part="navigation">
        <div id="toolbar">
          <button id="closeButton">⨉</button>
        </div>
        <slot></slot>
      </nav>
      <iframe id="frame" part="frame"></iframe>
    `;
  }
}

// Get a URL hash, return the path.
function getPathFromHash(hash) {
  const match = /#.*path=(?<path>[^&]+)/.exec(hash);
  return match?.groups?.path;
}

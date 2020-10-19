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

// We use a disconnected anchor to translate relative paths to absolute paths.
const referenceAnchor = document.createElement("a");

/**
 * Lightweight demo/story browser
 */
export default class StoryBrowser extends SlotContentMixin(ReactiveElement) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      defaultPath: null,
      links: [],
      path: getPathFromHash(),
    });
  }

  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      // Translate clicks on navigation links into changes to the hash. Changing
      // the hash will update the path state member, which will tell the frame
      // to load the page at that path.
      this[ids].navigation.addEventListener("click", (event) => {
        // Only handle clicks on links made without modifier keys.
        if (
          event.target instanceof HTMLAnchorElement &&
          !(event.ctrlKey || event.metaKey || event.shiftKey)
        ) {
          const pathname = event.target.pathname;
          const storyPath = getStoryPath(pathname);
          if (storyPath) {
            // A link to a story -- handle this ourselves.
            const location =
              pathname === this[state].defaultPath ? "" : `#path=${storyPath}`;
            window.location = location;
            event.preventDefault();
            event.stopPropagation();
          }
        }
      });

      // Refresh title on page load.
      this[ids].frame.addEventListener("load", () => {
        document.title = this[ids].frame.contentDocument.title;
      });

      // When hash changes, load the indicated page.
      window.addEventListener("hashchange", () => {
        this[raiseChangeEvents] = true;
        const path = getPathFromHash() || this[state].defaultPath;
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
      if (links && path) {
        // Mark any links which are current.
        links.forEach((link) => {
          const current = link.pathname === path;
          link.classList.toggle("current", current);
        });
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
      const defaultPath = state.links[0].pathname;
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
          overflow: auto;
        }

        [part~="frame"] {
          border: none;
          height: 100%;
          position: relative;
          width: 100%;
        }
      </style>
      <nav id="navigation" part="navigation">
        <slot></slot>
      </nav>
      <iframe id="frame" part="frame"></iframe>
    `;
  }
}

// If the given path is at or below the window location, return the relative
// path; otherwise return null.
function getStoryPath(absolutePath) {
  const windowPath = window.location.pathname;
  const storyPath = absolutePath.startsWith(windowPath)
    ? absolutePath.replace(windowPath, "")
    : null;
  return storyPath;
}

// Get #path=<path> from URL, return the path.
function getPathFromHash() {
  const match = /#path=(?<path>.+)/.exec(location.hash);
  if (match) {
    const path = match.groups.path;
    // Set the path on our reference anchor, then read it out again.
    referenceAnchor.href = path;
    return referenceAnchor.pathname;
  } else {
    return null;
  }
}

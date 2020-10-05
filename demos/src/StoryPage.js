import {
  defaultState,
  firstRender,
  ids,
  raiseChangeEvents,
  render,
  setState,
  state,
  template,
} from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

export default class StoryPage extends ReactiveElement {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      canvas: true,
      path: "about:blank",
      zoom: 1,
    });
  }

  get path() {
    return this[state].path;
  }
  set path(path) {
    this[setState]({ path });
  }

  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      this[ids].buttonNewTab.addEventListener("click", () => {
        this[raiseChangeEvents] = true;
        window.open(this[state].path);
        this[raiseChangeEvents] = false;
      });

      this[ids].frame.addEventListener("load", () => {
        this[raiseChangeEvents] = true;
        const title = this[ids].frame.contentDocument.title;
        const event = new CustomEvent("load", {
          detail: {
            title,
          },
        });
        this.dispatchEvent(event);
        this[raiseChangeEvents] = false;
      });
    }
    if (changed.path) {
      const { path } = this[state];
      const frame = this[ids].frame;
      if (frame.contentDocument.location.pathname !== path) {
        // Use `replace` to avoid affecting browser history.
        frame.contentWindow.location.replace(path);
      }
    }

    if (changed.zoom) {
      const contentDocument = this[ids].frame.contentDocument;
      const document = contentDocument ? contentDocument.documentElement : null;
      if (document) {
        document.style.zoom = this[state].zoom;
      }
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: grid;
          grid-template-rows: auto 1fr;
        }

        #toolbar {
          background: #333;
          color: #ccc;
          padding: 5px 20px;
        }

        .iconButton {
          align-items: center;
          background: none;
          border-bottom: 3px solid transparent;
          border-top: 3px solid transparent;
          border: 0 solid transparent;
          color: inherit;
          cursor: pointer;
          display: inline-flex;
          height: 40px;
          justify-content: center;
          padding: 0;
          transition: color 0.2s linear;
          width: 24px;
        }

        .iconButton:hover {
          color: #1EA7FD;
        }

        .iconButton svg {
          fill: currentColor;
          width: 15px;
        }

        #container {
          display: grid;
          position: relative;
        }

        #frame {
          border: none;
          height: 100%;
          width: 100%;
        }
      </style>
      <div id="toolbar">
        <button class="iconButton" id="buttonNewTab" title="Open in new tab">
          <svg viewBox="0 0 1024 1024">
            <path d="M896.006 920c0 22.090-17.91 40-40 40h-688.006c-22.090 0-40-17.906-40-40v-549.922c-0.838-3.224-1.33-6.588-1.33-10.072 0-22.090 17.908-40.004 40-40.004h178.66c22.092 0.004 40 17.914 40 40.004 0 22.088-17.908 40-40 40h-137.33v479.996h607.998v-479.996h-138.658c-22.090 0-40-17.912-40-40 0-22.090 17.906-40.004 40-40.004h178.658c22.090 0 40 17.91 40 40v559.844c0 0.050 0.008 0.102 0.008 0.154zM665.622 200.168l-124.452-124.45c-8.042-8.042-18.65-11.912-29.186-11.674-1.612-0.034-3.222 0-4.828 0.16-0.558 0.054-1.098 0.16-1.648 0.238-0.742 0.104-1.484 0.192-2.218 0.338-0.656 0.13-1.29 0.31-1.934 0.472-0.622 0.154-1.244 0.292-1.86 0.476-0.64 0.196-1.258 0.436-1.886 0.66-0.602 0.216-1.208 0.414-1.802 0.66-0.598 0.248-1.17 0.54-1.754 0.814-0.598 0.282-1.202 0.546-1.788 0.86-0.578 0.312-1.13 0.664-1.694 1-0.552 0.332-1.116 0.644-1.654 1.006-0.67 0.448-1.3 0.942-1.942 1.426-0.394 0.302-0.806 0.576-1.196 0.894-1.046 0.858-2.052 1.768-3.008 2.726l-124.398 124.39c-15.622 15.62-15.618 40.948 0.002 56.57 15.622 15.62 40.95 15.62 56.568 0l56.164-56.166v439.426c0 22.094 17.912 40 40.002 40 22.092 0 40-17.91 40-40v-441.202l57.942 57.942c15.622 15.624 40.948 15.62 56.568 0 15.626-15.618 15.626-40.946 0.002-56.566z" class="css-kqzqgg"></path>
          </svg>
        </button>
      </div>
      <div id="container">
        <iframe id="frame"></iframe>
      </div>
    `;
  }
}

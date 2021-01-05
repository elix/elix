import { fragmentFrom } from '../core/htmlLiterals.js';
import {
    defaultState,
    firstRender,
    ids,
    render,
    rendered,
    setState,
    state,
    template
} from './internal.js';
import WrappedStandardElement from './WrappedStandardElement.js';

const Base = WrappedStandardElement.wrap('label');

/**
 * Base class for custom label elements
 *
 * `Label` wraps a standard HTML `label` element, allowing for custom styling.
 * This component is mainly a workaround for the fact that AOM doesn't work yet,
 * so we need to add aria-hidden to labels so screen readers don't have information
 * duplicated.
 *
 * @inherits WrappedStandardElement
 * @part label - the inner standard HTML label
 */

class Label extends Base {
    get for() {
        return this[state].for;
    }

    set for(HTMLFor) {
        if (!this[state].removingAriaAttribute) {
            this[setState]({
                for: String(HTMLFor)
            });
        }
    }

    get [defaultState]() {
        return Object.assign(super[defaultState] || {}, {
            for: null,
            removingAriaAttribute: false
        });
    }

    [render](changed) {
        super[render](changed);

        if (this[firstRender]) {
            this[ids].inner.setAttribute('aria-hidden', 'true');
            this[ids].inner.addEventListener('click', () => {
                const HTMLFor = this[state].for;
                /** @type {any} */ const rootNode = this.isConnected
                    ? this.getRootNode()
                    : null;
                if (rootNode) {
                    const associatedInput = rootNode.querySelector(
                        `#${HTMLFor}`
                    );
                    if (associatedInput) {
                        associatedInput.focus();
                    }
                }
            });
        }

        if (changed.for) {
            const HTMLFor = this[state].for;
            if (HTMLFor) {
                this[ids].inner.setAttribute('for', HTMLFor);
            } else {
                this[ids].inner.removeAttribute('for');
            }
        }
    }

    [rendered](changed) {
        if (this[firstRender]) {
            const HTMLFor = this.getAttribute('for');
            this[setState]({ for: HTMLFor });
        }
        const HTMLFor = this[state].for;
        if (changed.for && !this[state].removingAriaAttribute) {
            if (this.getAttribute('for')) {
                this.setAttribute('delegated-for', HTMLFor);
                this[setState]({ removingAriaAttribute: true });
                this.removeAttribute('for');
            }
        }

        if (
            changed.removingAriaAttribute &&
            this[state].removingAriaAttribute
        ) {
            // We've done whatever removal we needed, and can now reset our flag.
            this[setState]({ removingAriaAttribute: false });
        }
    }

    get [template]() {
        const result = super[template];
        result.content.append(fragmentFrom.html`
        <style>
          [part~="label"] {
            font: inherit;
            text-align: inherit;
          }
        </style>
      `);
        return result;
    }
}

export default Label;

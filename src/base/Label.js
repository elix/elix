import { fragmentFrom } from '../core/htmlLiterals.js';
import { firstRender, ids, render, template } from './internal.js';
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
    [render](/** @type {ChangedFlags} */ changed) {
        super[render](changed);

        if (this[firstRender]) {
            this[ids].inner.setAttribute('aria-hidden', 'true');
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

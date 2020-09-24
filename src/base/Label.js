import { fragmentFrom } from '../core/htmlLiterals.js';
import {
    defaultState,
    // firstRender,
    // ids,
    // inputDelegate,
    // raiseChangeEvents,
    // render,
    state,
    setState,
    template
} from './internal.js';
import WrappedStandardElement from './WrappedStandardElement.js';

const Base = WrappedStandardElement.wrap('label');

/**
 * Base class for custom label elements
 *
 * `Label` wraps a standard HTML `label` element, allowing for custom styling
 * and behavior while ensuring all users, regardless of assistive technology, get the same information.
 *
 * @inherits WrappedStandardElement
 * @part label - the inner standard HTML label
 */

class Label extends Base {
    get [defaultState]() {
        return Object.assign(super[defaultState], {
            label: ''
        });
    }

    // [render](/** @type {ChangedFlags} */ changed) {
    //   super[render](changed);
    // }

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

    get label() {
        return this[state].label;
    }
    set label(label) {
        this[setState]({ label: label });
    }
}

export default Label;

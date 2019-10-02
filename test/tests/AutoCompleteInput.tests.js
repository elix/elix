import {
  default as AutoCompleteInput,
  autoComplete
} from '../../src/AutoCompleteInput.js';
import * as internal from '../../src/internal.js';

customElements.define('auto-complete-input', AutoCompleteInput);

describe('AutoCompleteInput', () => {
  it('can match against texts', async () => {
    const fixture = new AutoCompleteInput();
    fixture.texts = ['Canary', 'Cat', 'Dog'];
    fixture.value = 'C';
    autoComplete(fixture);
    fixture[internal.renderChanges]();
    assert.equal(fixture.value, 'Canary');
  });
});

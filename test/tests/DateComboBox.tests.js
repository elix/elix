import * as calendar from '../../src/calendar.js';
import DateComboBox from '../../src/DateComboBox.js';


describe("DateComboBox", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("parses value according to locale", async () => {
    const fixture = new DateComboBox();
    fixture.locale = 'en-US';
    fixture.value = '1/2/2019'; // 2 Jan 2019
    container.appendChild(fixture);
    await Promise.resolve();
    const expectedDate1 = new Date(2019, 0, 2); // 2 Jan 2019
    assert(calendar.datesEqual(fixture.date, expectedDate1));
    // Reparse value with new locale.
    fixture.locale = 'en-GB';
    await Promise.resolve();
    const expectedDate2 = new Date(2019, 1, 1); // 1 Feb 2019
    assert(calendar.datesEqual(fixture.date, expectedDate2));
  });

  it("parses date according to locale", async () => {
    const fixture = new DateComboBox();
    fixture.locale = 'en-US';
    fixture.date = new Date(2019, 0, 2); // 2 Jan 2019
    container.appendChild(fixture);
    await Promise.resolve();
    assert.equal(fixture.value, '1/2/2019');
    // Reformate date with new locale.
    fixture.locale = 'en-GB';
    await Promise.resolve();
    assert.equal(fixture.value, '2/1/2019');
  });

});

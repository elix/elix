import { trimMarks } from '../normalize.js';
import * as internal from '../../src/internal.js';
import CalendarMonthYearHeader from '../../src/CalendarMonthYearHeader.js';


describe("CalendarMonthYearHeader", () => {

  it("renders English US month header", async () => {
    const fixture = new CalendarMonthYearHeader();
    fixture.locale = 'en-US';
    fixture.date = new Date('10 March 2015');
    await fixture[internal.renderChanges]();
    assert.equal(trimMarks(fixture[internal.$].formatted.textContent), 'March 2015');
  });

  it("renders Japanese month header", async () => {
    const fixture = new CalendarMonthYearHeader();
    fixture.locale = 'ja-JP';
    fixture.date = new Date('10 March 2015');
    await fixture[internal.renderChanges]();
    assert.equal(trimMarks(fixture[internal.$].formatted.textContent), '2015年3月');
  });

});

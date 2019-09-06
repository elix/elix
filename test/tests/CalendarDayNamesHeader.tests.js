import { trimMarks } from '../normalize.js';
import * as internal from '../../src/internal.js';
import CalendarDayNamesHeader from '../../src/CalendarDayNamesHeader.js';


describe("CalendarDayNamesHeader", () => {

  it("renders short English US week days", async () => {
    const fixture = new CalendarDayNamesHeader();
    fixture.locale = 'en-US';
    await fixture[internal.renderChanges]();
    assert.equal(trimMarks(fixture[internal.$].day0.textContent), 'Sun');
    assert.equal(trimMarks(fixture[internal.$].day1.textContent), 'Mon');
    assert.equal(trimMarks(fixture[internal.$].day2.textContent), 'Tue');
    assert.equal(trimMarks(fixture[internal.$].day3.textContent), 'Wed');
    assert.equal(trimMarks(fixture[internal.$].day4.textContent), 'Thu');
    assert.equal(trimMarks(fixture[internal.$].day5.textContent), 'Fri');
    assert.equal(trimMarks(fixture[internal.$].day6.textContent), 'Sat');
  });

  it("renders narrow English US week days", async () => {
    const fixture = new CalendarDayNamesHeader();
    fixture.locale = 'en-US';
    fixture.format = 'narrow';
    await fixture[internal.renderChanges]();
    // Edge shows "Su", everyone else shows "S".
    const trimmed = trimMarks(fixture[internal.$].day0.textContent);
    assert(trimmed === 'S' || trimmed === 'Su');
  });

  it("renders short French week days", async () => {
    const fixture = new CalendarDayNamesHeader();
    fixture.locale = 'fr-FR';
    await fixture[internal.renderChanges]();
    assert.equal(trimMarks(fixture[internal.$].day0.textContent), 'lun.'); // A Monday
    assert.equal(trimMarks(fixture[internal.$].day1.textContent), 'mar.');
    assert.equal(trimMarks(fixture[internal.$].day2.textContent), 'mer.');
    assert.equal(trimMarks(fixture[internal.$].day3.textContent), 'jeu.');
    assert.equal(trimMarks(fixture[internal.$].day4.textContent), 'ven.');
    assert.equal(trimMarks(fixture[internal.$].day5.textContent), 'sam.');
    assert.equal(trimMarks(fixture[internal.$].day6.textContent), 'dim.');
  });

});

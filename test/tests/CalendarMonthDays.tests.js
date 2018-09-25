import CalendarMonthDays from '../../src/CalendarMonthDays.js';


describe("CalendarMonthDays", () => {

  it("creates weeks for a given month", async () => {
    const fixture = new CalendarMonthDays();
    fixture.locale = 'en-US';
    fixture.date = new Date('10 March 2015');
    assert.deepEqual(fixture.firstDateOfMonth, new Date('1 March 2015'));
    assert.deepEqual(fixture.lastDateOfMonth, new Date('31 March 2015'));
    await fixture.render();
    const weeks = fixture.weeks;
    assert.deepEqual(weeks[0].date, new Date('1 March 2015'));
    assert.deepEqual(weeks[5].date, new Date('5 April 2015'));

  });

});

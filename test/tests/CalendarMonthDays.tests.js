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

  it("returns day elements inside the calendar's range", async () => {
    const fixture = new CalendarMonthDays();
    const date = new Date('10 March 2015');
    fixture.date = date;
    await fixture.render();
    const days = fixture.days;
    assert.equal(fixture.dayElementForDate(date), days[9]);
    const dateOutOfRange = new Date('1 Jan 2016');
    assert.isNull(fixture.dayElementForDate(dateOutOfRange));
  });

});

import CalendarWeek from '../../src/CalendarWeek.js';


describe("CalendarWeek", () => {

  it("renders a US week", async () => {
    const fixture = new CalendarWeek();
    fixture.locale = 'en-US';
    fixture.date = new Date('10 March 2015'); // A Tuesday
    await fixture.render();
    const days = fixture.days;
    assert.equal(days[0].date.getDate(), 8); // A Sunday
    assert.equal(days[1].date.getDate(), 9);
    assert.equal(days[2].date.getDate(), 10);
    assert.equal(days[3].date.getDate(), 11);
    assert.equal(days[4].date.getDate(), 12);
    assert.equal(days[5].date.getDate(), 13);
    assert.equal(days[6].date.getDate(), 14);
  });

  it("renders a French week", async () => {
    const fixture = new CalendarWeek();
    fixture.locale = 'fr-FR';
    fixture.date = new Date('10 March 2015'); // A Tuesday
    await fixture.render();
    const days = fixture.days;
    assert.equal(days[0].date.getDate(), 9); // A Monday
    assert.equal(days[1].date.getDate(), 10);
    assert.equal(days[2].date.getDate(), 11);
    assert.equal(days[3].date.getDate(), 12);
    assert.equal(days[4].date.getDate(), 13);
    assert.equal(days[5].date.getDate(), 14);
    assert.equal(days[6].date.getDate(), 15);
  });

  it("returns day elements inside the calendar's range", async () => {
    const fixture = new CalendarWeek();
    fixture.locale = 'en-US';
    const date = new Date('10 March 2015');
    fixture.date = date;
    await fixture.render();
    const days = fixture.days;
    assert.equal(fixture.dayElementForDate(date), days[2]);
    const dateOutOfRange = new Date('15 March 2015');
    assert.isNull(fixture.dayElementForDate(dateOutOfRange));
  });

});

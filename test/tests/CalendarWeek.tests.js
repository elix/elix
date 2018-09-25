import CalendarWeek from '../../src/CalendarWeek.js';


describe("CalendarWeek", () => {

  it("renders a US week", async () => {
    const week = new CalendarWeek();
    week.locale = 'en-US';
    week.date = new Date('10 March 2015'); // A Tuesday
    await week.render();
    assert.equal(week.$.day0.textContent, '8');
    assert.equal(week.$.day1.textContent, '9');
    assert.equal(week.$.day2.textContent, '10');
    assert.equal(week.$.day3.textContent, '11');
    assert.equal(week.$.day4.textContent, '12');
    assert.equal(week.$.day5.textContent, '13');
    assert.equal(week.$.day6.textContent, '14');
  });

  it("renders a French week", async () => {
    const week = new CalendarWeek();
    week.locale = 'fr-FR';
    week.date = new Date('10 March 2015'); // A Tuesday
    await week.render();
    assert.equal(week.$.day0.textContent, '9'); // A Monday
    assert.equal(week.$.day1.textContent, '10');
    assert.equal(week.$.day2.textContent, '11');
    assert.equal(week.$.day3.textContent, '12');
    assert.equal(week.$.day4.textContent, '13');
    assert.equal(week.$.day5.textContent, '14');
    assert.equal(week.$.day6.textContent, '15');
  });

});

import CalendarWeek from '../../src/CalendarWeek.js';


describe("CalendarWeek", () => {

  it("renders a US week", async () => {
    const fixture = new CalendarWeek();
    fixture.locale = 'en-US';
    fixture.date = new Date('10 March 2015'); // A Tuesday
    await fixture.render();
    const days = fixture.days;
    assert.equal(days[0].textContent, '8');
    assert.equal(days[1].textContent, '9');
    assert.equal(days[2].textContent, '10');
    assert.equal(days[3].textContent, '11');
    assert.equal(days[4].textContent, '12');
    assert.equal(days[5].textContent, '13');
    assert.equal(days[6].textContent, '14');
  });

  it("renders a French week", async () => {
    const fixture = new CalendarWeek();
    fixture.locale = 'fr-FR';
    fixture.date = new Date('10 March 2015'); // A Tuesday
    await fixture.render();
    const days = fixture.days;
    assert.equal(days[0].textContent, '9'); // A Monday
    assert.equal(days[1].textContent, '10');
    assert.equal(days[2].textContent, '11');
    assert.equal(days[3].textContent, '12');
    assert.equal(days[4].textContent, '13');
    assert.equal(days[5].textContent, '14');
    assert.equal(days[6].textContent, '15');
  });

});

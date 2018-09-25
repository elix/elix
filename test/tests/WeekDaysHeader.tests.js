import WeekDaysHeader from '../../src/WeekDaysHeader.js';


describe("WeekDaysHeader", () => {

  it("renders short English US week days", async () => {
    const fixture = new WeekDaysHeader();
    fixture.locale = 'en-US';
    await fixture.render();
    assert.equal(fixture.$.day0.textContent, 'Sun');
    assert.equal(fixture.$.day1.textContent, 'Mon');
    assert.equal(fixture.$.day2.textContent, 'Tue');
    assert.equal(fixture.$.day3.textContent, 'Wed');
    assert.equal(fixture.$.day4.textContent, 'Thu');
    assert.equal(fixture.$.day5.textContent, 'Fri');
    assert.equal(fixture.$.day6.textContent, 'Sat');
  });

  it("renders narrow English US week days", async () => {
    const fixture = new WeekDaysHeader();
    fixture.locale = 'en-US';
    fixture.format = 'narrow';
    await fixture.render();
    assert.equal(fixture.$.day0.textContent, 'S');
    assert.equal(fixture.$.day1.textContent, 'M');
    assert.equal(fixture.$.day2.textContent, 'T');
    assert.equal(fixture.$.day3.textContent, 'W');
    assert.equal(fixture.$.day4.textContent, 'T');
    assert.equal(fixture.$.day5.textContent, 'F');
    assert.equal(fixture.$.day6.textContent, 'S');
  });

  it("renders short French week days", async () => {
    const fixture = new WeekDaysHeader();
    fixture.locale = 'fr-FR';
    await fixture.render();
    assert.equal(fixture.$.day0.textContent, 'lun.'); // A Monday
    assert.equal(fixture.$.day1.textContent, 'mar.');
    assert.equal(fixture.$.day2.textContent, 'mer.');
    assert.equal(fixture.$.day3.textContent, 'jeu.');
    assert.equal(fixture.$.day4.textContent, 'ven.');
    assert.equal(fixture.$.day5.textContent, 'sam.');
    assert.equal(fixture.$.day6.textContent, 'dim.');
  });

});

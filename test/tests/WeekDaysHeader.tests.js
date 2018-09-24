import WeekDaysHeader from '../../src/WeekDaysHeader.js';


describe("WeekDaysHeader", () => {

  it("renders short English US week days", async () => {
    const header = new WeekDaysHeader();
    header.locale = 'en-US';
    await header.render();
    assert.equal(header.$.day0.textContent, 'Sun');
    assert.equal(header.$.day1.textContent, 'Mon');
    assert.equal(header.$.day2.textContent, 'Tue');
    assert.equal(header.$.day3.textContent, 'Wed');
    assert.equal(header.$.day4.textContent, 'Thu');
    assert.equal(header.$.day5.textContent, 'Fri');
    assert.equal(header.$.day6.textContent, 'Sat');
  });

  it("renders narrow English US week days", async () => {
    const header = new WeekDaysHeader();
    header.locale = 'en-US';
    header.format = 'narrow';
    await header.render();
    assert.equal(header.$.day0.textContent, 'S');
    assert.equal(header.$.day1.textContent, 'M');
    assert.equal(header.$.day2.textContent, 'T');
    assert.equal(header.$.day3.textContent, 'W');
    assert.equal(header.$.day4.textContent, 'T');
    assert.equal(header.$.day5.textContent, 'F');
    assert.equal(header.$.day6.textContent, 'S');
  });

  it("renders short French week days", async () => {
    const header = new WeekDaysHeader();
    header.locale = 'fr-FR';
    await header.render();
    assert.equal(header.$.day0.textContent, 'lun.'); // A Monday
    assert.equal(header.$.day1.textContent, 'mar.');
    assert.equal(header.$.day2.textContent, 'mer.');
    assert.equal(header.$.day3.textContent, 'jeu.');
    assert.equal(header.$.day4.textContent, 'ven.');
    assert.equal(header.$.day5.textContent, 'sam.');
    assert.equal(header.$.day6.textContent, 'dim.');
  });

});

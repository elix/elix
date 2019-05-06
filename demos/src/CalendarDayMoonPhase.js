import { getSuperProperty } from '../../src/workarounds.js';
import { merge } from '../../src/updates.js';
import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import CalendarDay from '../../src/CalendarDay.js';


/*
 * Shows an icon for the moon phase for a given date.
 * 
 * The phases are calculated for UTC (Universal Coordinated Time). Local moon
 * phases will vary.
 *
 * Moon phase icons modified from icons from flaticon.com by Freepik under
 * CC-BY.
 */
class CalendarDayMoonPhase extends CalendarDay {

  [symbols.render](state, changed) {
    super[symbols.render](state, changed);
    if (changed.date) {
      // To determine quarter, we compare the moon's angle at midnight on the
      // given date with the angle at midnight on the following date.
      const date = this.state.date;
      const angle = moonAngle(date);
      const dateNext = new Date(date.getTime());
      dateNext.setDate(dateNext.getDate() + 1); // Increment date.
      const angleNext = moonAngle(dateNext);

      // See if the moon's angle crosses a threshold during the given date.
      let quarter;
      if (angle >= 0 && angleNext > angle) {
        quarter = "full"; // Full moon
      } else if (angle >= 90 && angleNext < 90) {
        quarter = "firstQuarter"; // First quarter
      } else if (angle >= 180 && angleNext < 180) {
        quarter = "new"; // New moon
      } else if (angle >= 270 && angleNext < 270) {
        quarter = "lastQuarter"; // Last quarter
      } else {
        quarter = null; // Nothing special
      }

      // Show or hide an icon as appropriate.
      if (quarter) {
        this.$.phaseIcon.src = `images/moon/${quarter}.svg`
      } else {
        this.$.phaseIcon.removeAttribute('src');
      }
    }
  }

  get [symbols.template]() {
    // Next line is same as: const base = super[symbols.template]
    const base = getSuperProperty(this, CalendarDayMoonPhase, symbols.template);
    return template.concat(base, template.html`
      <style>
        #phaseIcon {
          height: 1.5em;
          width: 1.5em;
        }
        
        #phaseIcon:not([src]) {
          visibility: hidden;
        }
      </style>
      <img id="phaseIcon">
    `);
  }

}


// Return the phase angle of the moon.
// This is lifted from the JavaScript Ephemeris page by Peter Hayes at
// http://www2.arnes.si/~gljsentvid10/jspodatkinanebu.html. That work in turn
// is based on Meeus chapter 45 and the illuminated percentage from Meeus
// equations 46.4 and 46.1.
function moonAngle(date) {
  const jd = jd0(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const T = (jd-2451545.0)/36525;
  const T2 = T*T;
  const T3 = T2*T;
  const T4 = T3*T;
  // Moons mean elongation
  const D = 297.8501921+445267.1114034*T-0.0018819*T2+T3/545868.0-T4/113065000.0;
  // Suns mean anomaly
  const M = 357.5291092+35999.0502909*T-0.0001536*T2+T3/24490000.0;
  // Moons mean anomaly M'
  const MP = 134.9633964+477198.8675055*T+0.0087414*T2+T3/69699.0-T4/14712000.0;
  // phase angle
  const pa = 180.0-D-6.289*sind(MP)+2.1*sind(M)-1.274*sind(2*D-MP)
          -0.658*sind(2*D)-0.214*sind(2*MP)-0.11*sind(D);
  return rev(pa);
}


// The Julian date at 0 hours UT at Greenwich
function jd0(year, month, day) {
  let y  = year;
  let m = month;
  if (m < 3) {
    m += 12;
    y -= 1
  };
  const a = Math.floor(y/100);
  const b = 2-a+Math.floor(a/4);
  const j = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+day+b-1524.5;
  return j;
}


// Extensions to the Math routines - Trig routines in degrees
function rev(angle) {
  return angle-Math.floor(angle/360.0)*360.0;
}
function sind(angle) {
  return Math.sin((angle*Math.PI)/180.0);
}


customElements.define('calendar-day-moon-phase', CalendarDayMoonPhase);
export default CalendarDayMoonPhase;

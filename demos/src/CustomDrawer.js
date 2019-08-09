import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import DrawerWithGrip from '../../src/DrawerWithGrip.js';


export default class CustomDrawer extends DrawerWithGrip {

  get defaultState() {
    return Object.assign(super.defaultState, {
      fromEdge: 'right'
    });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if ((changed.gripSize || changed.opened || changed.swipeFraction) &&
      this.$.plusIcon) {
      // Rotate the toggle button as the drawer is opened.
      const { opened, swipeFraction } = this.state;
      const rotationFraction = (opened ? 1 : 0) - swipeFraction;
      const boundedRotationFraction =
        Math.max(Math.min(rotationFraction, 1), 0)
      const rotation = -boundedRotationFraction * 45;
      const transform = `rotate(${rotation}deg)`;
      this.$.plusIcon.style.transform = transform;
    }    
  }

  get [symbols.template]() {
    const result = super[symbols.template];
    const gripTemplate = template.html`
      <div id="plusIcon">+</div>
    `;
    const gripSlot = result.content.querySelector('slot[name="grip"]');
    gripSlot.innerHTML = '';
    gripSlot.append(gripTemplate.content);
    return template.concat(result, template.html`
      <style>
        #frame {
          background: rgba(26,36,46,0.9);
          color: white;
          width: 100%;
        }

        #plusIcon {
          color: #00c8aa;
          font-family: "Varela Round", sans-serif;
          font-size: 80px;
          font-weight: bold;
          padding: 8px;
          -webkit-text-stroke: 4px currentColor;
          transition: color 0.25s;
        }

        #grip:hover #plusIcon {
          color: #16FFDC;
        }
      </style>
    `);
  }

}


customElements.define('custom-drawer', CustomDrawer);

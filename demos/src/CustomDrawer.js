import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";
import DrawerWithGrip from "../../src/base/DrawerWithGrip.js";

export default class CustomDrawer extends DrawerWithGrip {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      fromEdge: "right"
    });
  }

  [internal.render](changed) {
    super[internal.render](changed);
    if (
      (changed.gripSize || changed.opened || changed.swipeFraction) &&
      this[internal.ids].plusIcon
    ) {
      // Rotate the toggle button as the drawer is opened.
      const { opened, swipeFraction } = this[internal.state];
      const rotationFraction = (opened ? 1 : 0) - swipeFraction;
      const boundedRotationFraction = Math.max(
        Math.min(rotationFraction, 1),
        0
      );
      const rotation = -boundedRotationFraction * 45;
      const transform = `rotate(${rotation}deg)`;
      this[internal.ids].plusIcon.style.transform = transform;
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    const gripTemplate = template.html`
      <div id="plusIcon">+</div>
    `;
    const gripSlot = result.content.querySelector('slot[name="grip"]');
    gripSlot.innerHTML = "";
    gripSlot.append(gripTemplate.content);

    result.content.append(
      template.html`
        <style>
          [part~="frame"] {
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
      `.content
    );
    return result;
  }
}

customElements.define("custom-drawer", CustomDrawer);

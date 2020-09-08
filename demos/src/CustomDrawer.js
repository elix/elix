import DrawerWithGrip from "../../src/base/DrawerWithGrip.js";
import {
  defaultState,
  ids,
  render,
  state,
  template,
} from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";

export default class CustomDrawer extends DrawerWithGrip {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      fromEdge: "right",
    });
  }

  [render](changed) {
    super[render](changed);
    if (
      (changed.gripSize || changed.opened || changed.swipeFraction) &&
      this[ids].plusIcon
    ) {
      // Rotate the toggle button as the drawer is opened.
      const { opened, swipeFraction } = this[state];
      const rotationFraction = (opened ? 1 : 0) - swipeFraction;
      const boundedRotationFraction = Math.max(
        Math.min(rotationFraction, 1),
        0
      );
      const rotation = -boundedRotationFraction * 45;
      const transform = `rotate(${rotation}deg)`;
      this[ids].plusIcon.style.transform = transform;
    }
  }

  get [template]() {
    const result = super[template];

    const gripTemplate = templateFrom.html`
      <div id="plusIcon">+</div>
    `;
    const gripSlot = result.content.querySelector('slot[name="grip"]');
    gripSlot.innerHTML = "";
    gripSlot.append(gripTemplate.content);

    result.content.append(
      templateFrom.html`
        <style>
          [part~=frame] {
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

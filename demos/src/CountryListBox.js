/*
 * Demo of a list box with hard-coded contents.
 */

import AriaListMixin from "../../src/base/AriaListMixin.js";
import ContentItemsMixin from "../../src/base/ContentItemsMixin.js";
import CurrentItemInViewMixin from "../../src/base/CurrentItemInViewMixin.js";
import CursorAPIMixin from "../../src/base/CursorAPIMixin.js";
import DirectionCursorMixin from "../../src/base/DirectionCursorMixin.js";
import * as internal from "../../src/base/internal.js";
import ItemsAPIMixin from "../../src/base/ItemsAPIMixin.js";
import ItemsTextMixin from "../../src/base/ItemsTextMixin.js";
import KeyboardDirectionMixin from "../../src/base/KeyboardDirectionMixin.js";
import KeyboardMixin from "../../src/base/KeyboardMixin.js";
import KeyboardPagedSelectionMixin from "../../src/base/KeyboardPagedSelectionMixin.js";
import KeyboardPrefixSelectionMixin from "../../src/base/KeyboardPrefixSelectionMixin.js";
import LanguageDirectionMixin from "../../src/base/LanguageDirectionMixin.js";
import SelectedItemTextValueMixin from "../../src/base/SelectedItemTextValueMixin.js";
import SingleSelectAPIMixin from "../../src/base/SingleSelectAPIMixin.js";
import TapSelectionMixin from "../../src/base/TapSelectionMixin.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";
import * as template from "../../src/core/template.js";

const Base = AriaListMixin(
  ContentItemsMixin(
    CursorAPIMixin(
      DirectionCursorMixin(
        ItemsAPIMixin(
          ItemsTextMixin(
            KeyboardDirectionMixin(
              KeyboardMixin(
                KeyboardPagedSelectionMixin(
                  KeyboardPrefixSelectionMixin(
                    LanguageDirectionMixin(
                      SelectedItemTextValueMixin(
                        CurrentItemInViewMixin(
                          SingleSelectAPIMixin(
                            TapSelectionMixin(ReactiveElement)
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
);

class CountryListBox extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      orientation: "vertical",
    });
  }

  get orientation() {
    return this[internal.state].orientation;
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.items || changed.selectedIndex) {
      // Apply `selected` style to the selected item only.
      const { selectedIndex, items } = this[internal.state];
      if (items) {
        items.forEach((item, index) => {
          const selected = index === selectedIndex;
          item.toggleAttribute("selected", selected);
        });
      }
    }
  }

  [internal.rendered](changed) {
    super[internal.rendered](changed);

    if (this[internal.firstRender]) {
      const content = this[internal.ids].content.children;
      this[internal.setState]({ content });
    }
  }

  get [internal.scrollTarget]() {
    return this[internal.ids].content;
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          border: 1px solid gray;
          box-sizing: border-box;
          cursor: default;
          display: flex;
          -webkit-tap-highlight-color: transparent;
        }

        #content {
          display: flex;
          flex-direction: column;
          flex: 1;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
          overflow-x: hidden;
          overflow-y: scroll;
        }

        #content > * {
          padding: 0.25em;
        }

        #content > [selected] {
          background: highlight;
          color: highlighttext;
        }
      </style>
      <div id="content" role="none">
        <div>Afghanistan</div>
        <div>Albania</div>
        <div>Algeria</div>
        <div>Andorra</div>
        <div>Angola</div>
        <div>Antigua and Barbuda</div>
        <div>Argentina</div>
        <div>Armenia</div>
        <div>Australia</div>
        <div>Austria</div>
        <div>Azerbaijan</div>
        <div>Bahamas</div>
        <div>Bahrain</div>
        <div>Bangladesh</div>
        <div>Barbados</div>
        <div>Belarus</div>
        <div>Belgium</div>
        <div>Belize</div>
        <div>Benin</div>
        <div>Bhutan</div>
        <div>Bolivia</div>
        <div>Bosnia and Herzegovina</div>
        <div>Botswana</div>
        <div>Brazil</div>
        <div>Brunei</div>
        <div>Bulgaria</div>
        <div>Burkina Faso</div>
        <div>Burundi</div>
        <div>Cambodia</div>
        <div>Cameroon</div>
        <div>Canada</div>
        <div>Cape Verde</div>
        <div>Central African Republic</div>
        <div>Chad</div>
        <div>Chile</div>
        <div>China</div>
        <div>Colombia</div>
        <div>Comoros</div>
        <div>Costa Rica</div>
        <div>Croatia</div>
        <div>Cuba</div>
        <div>Cyprus</div>
        <div>Czech Republic</div>
        <div>Democratic Republic of the Congo</div>
        <div>Denmark</div>
        <div>Djibouti</div>
        <div>Dominica</div>
        <div>Dominican Republic</div>
        <div>East Timor</div>
        <div>Ecuador</div>
        <div>Egypt</div>
        <div>El Salvador</div>
        <div>Equatorial Guinea</div>
        <div>Eritrea</div>
        <div>Estonia</div>
        <div>Ethiopia</div>
        <div>Fiji</div>
        <div>Finland</div>
        <div>France</div>
        <div>Gabon</div>
        <div>Gambia</div>
        <div>Georgia</div>
        <div>Germany</div>
        <div>Ghana</div>
        <div>Greece</div>
        <div>Grenada</div>
        <div>Guatemala</div>
        <div>Guinea</div>
        <div>Guinea-Bissau</div>
        <div>Guyana</div>
        <div>Haiti</div>
        <div>Honduras</div>
        <div>Hungary</div>
        <div>Iceland</div>
        <div>India</div>
        <div>Indonesia</div>
        <div>Iran</div>
        <div>Iraq</div>
        <div>Ireland</div>
        <div>Israel</div>
        <div>Italy</div>
        <div>Ivory Coast</div>
        <div>Jamaica</div>
        <div>Japan</div>
        <div>Jordan</div>
        <div>Kazakhstan</div>
        <div>Kenya</div>
        <div>Kiribati</div>
        <div>Kuwait</div>
        <div>Kyrgyzstan</div>
        <div>Laos</div>
        <div>Latvia</div>
        <div>Lebanon</div>
        <div>Lesotho</div>
        <div>Liberia</div>
        <div>Libya</div>
        <div>Liechtenstein</div>
        <div>Lithuania</div>
        <div>Luxembourg</div>
        <div>Macedonia</div>
        <div>Madagascar</div>
        <div>Malawi</div>
        <div>Malaysia</div>
        <div>Maldives</div>
        <div>Mali</div>
        <div>Malta</div>
        <div>Marshall Islands</div>
        <div>Mauritania</div>
        <div>Mauritius</div>
        <div>Mexico</div>
        <div>Micronesia</div>
        <div>Moldova</div>
        <div>Monaco</div>
        <div>Mongolia</div>
        <div>Montenegro</div>
        <div>Morocco</div>
        <div>Mozambique</div>
        <div>Myanmar</div>
        <div>Namibia</div>
        <div>Nauru</div>
        <div>Nepal</div>
        <div>Netherlands</div>
        <div>New Zealand</div>
        <div>Nicaragua</div>
        <div>Niger</div>
        <div>Nigeria</div>
        <div>North Korea</div>
        <div>Norway</div>
        <div>Oman</div>
        <div>Pakistan</div>
        <div>Palau</div>
        <div>Palestine</div>
        <div>Panama</div>
        <div>Papua New Guinea</div>
        <div>Paraguay</div>
        <div>Peru</div>
        <div>Philippines</div>
        <div>Poland</div>
        <div>Portugal</div>
        <div>Qatar</div>
        <div>Republic of the Congo</div>
        <div>Romania</div>
        <div>Russia</div>
        <div>Rwanda</div>
        <div>Saint Kitts and Nevis</div>
        <div>Saint Lucia</div>
        <div>Saint Vincent and the Grenadines</div>
        <div>Samoa</div>
        <div>San Marino</div>
        <div>São Tomé and Príncipe</div>
        <div>Saudi Arabia</div>
        <div>Senegal</div>
        <div>Serbia</div>
        <div>Seychelles</div>
        <div>Sierra Leone</div>
        <div>Singapore</div>
        <div>Slovakia</div>
        <div>Slovenia</div>
        <div>Solomon Islands</div>
        <div>Somalia</div>
        <div>South Africa</div>
        <div>South Korea</div>
        <div>South Sudan</div>
        <div>Spain</div>
        <div>Sri Lanka</div>
        <div>Sudan</div>
        <div>Suriname</div>
        <div>Swaziland</div>
        <div>Sweden</div>
        <div>Switzerland</div>
        <div>Syria</div>
        <div>Taiwan</div>
        <div>Tajikistan</div>
        <div>Tanzania</div>
        <div>Thailand</div>
        <div>Togo</div>
        <div>Tonga</div>
        <div>Trinidad and Tobago</div>
        <div>Tunisia</div>
        <div>Turkey</div>
        <div>Turkmenistan</div>
        <div>Tuvalu</div>
        <div>Uganda</div>
        <div>Ukraine</div>
        <div>United Arab Emirates</div>
        <div>United Kingdom</div>
        <div>United States</div>
        <div>Uruguay</div>
        <div>Uzbekistan</div>
        <div>Vanuatu</div>
        <div>Vatican City</div>
        <div>Venezuela</div>
        <div>Vietnam</div>
        <div>Yemen</div>
        <div>Zambia</div>
        <div>Zimbabwe</div>
      </div>
    `;
  }
}

customElements.define("country-list-box", CountryListBox);
export default CountryListBox;

import { applyChildNodes } from "../../src/core/dom.js";
import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

// Locale list from https://stackoverflow.com/questions/3191664/list-of-all-locales-and-their-short-codes/28357857#28357857
// This includes only locales with regions; it omits languages without regions.
/** @type {IndexedObject<string>} */
const locales = {
  "af-NA": "Afrikaans (Namibia)",
  "af-ZA": "Afrikaans (South Africa)",
  "ak-GH": "Akan (Ghana)",
  "sq-AL": "Albanian (Albania)",
  "am-ET": "Amharic (Ethiopia)",
  "ar-DZ": "Arabic (Algeria)",
  "ar-BH": "Arabic (Bahrain)",
  "ar-EG": "Arabic (Egypt)",
  "ar-IQ": "Arabic (Iraq)",
  "ar-JO": "Arabic (Jordan)",
  "ar-KW": "Arabic (Kuwait)",
  "ar-LB": "Arabic (Lebanon)",
  "ar-LY": "Arabic (Libya)",
  "ar-MA": "Arabic (Morocco)",
  "ar-OM": "Arabic (Oman)",
  "ar-QA": "Arabic (Qatar)",
  "ar-SA": "Arabic (Saudi Arabia)",
  "ar-SD": "Arabic (Sudan)",
  "ar-SY": "Arabic (Syria)",
  "ar-TN": "Arabic (Tunisia)",
  "ar-AE": "Arabic (United Arab Emirates)",
  "ar-YE": "Arabic (Yemen)",
  "hy-AM": "Armenian (Armenia)",
  "as-IN": "Assamese (India)",
  "asa-TZ": "Asu (Tanzania)",
  "az-Cyrl-AZ": "Azerbaijani (Cyrillic, Azerbaijan)",
  "az-Latn-AZ": "Azerbaijani (Latin, Azerbaijan)",
  "bm-ML": "Bambara (Mali)",
  "eu-ES": "Basque (Spain)",
  "be-BY": "Belarusian (Belarus)",
  "bem-ZM": "Bemba (Zambia)",
  "bez-TZ": "Bena (Tanzania)",
  "bn-BD": "Bengali (Bangladesh)",
  "bn-IN": "Bengali (India)",
  "bs-BA": "Bosnian (Bosnia and Herzegovina)",
  "bg-BG": "Bulgarian (Bulgaria)",
  "my-MM": "Burmese (Myanmar [Burma])",
  "ca-ES": "Catalan (Spain)",
  "tzm-Latn-MA": "Central Morocco Tamazight (Latin, Morocco)",
  "chr-US": "Cherokee (United States)",
  "cgg-UG": "Chiga (Uganda)",
  "zh-Hans-CN": "Chinese (Simplified Han, China)",
  "zh-Hans-HK": "Chinese (Simplified Han, Hong Kong SAR China)",
  "zh-Hans-MO": "Chinese (Simplified Han, Macau SAR China)",
  "zh-Hans-SG": "Chinese (Simplified Han, Singapore)",
  "zh-Hant-HK": "Chinese (Traditional Han, Hong Kong SAR China)",
  "zh-Hant-MO": "Chinese (Traditional Han, Macau SAR China)",
  "zh-Hant-TW": "Chinese (Traditional Han, Taiwan)",
  "kw-GB": "Cornish (United Kingdom)",
  "hr-HR": "Croatian (Croatia)",
  "cs-CZ": "Czech (Czech Republic)",
  "da-DK": "Danish (Denmark)",
  "nl-BE": "Dutch (Belgium)",
  "nl-NL": "Dutch (Netherlands)",
  "ebu-KE": "Embu (Kenya)",
  "en-AS": "English (American Samoa)",
  "en-AU": "English (Australia)",
  "en-BE": "English (Belgium)",
  "en-BZ": "English (Belize)",
  "en-BW": "English (Botswana)",
  "en-CA": "English (Canada)",
  "en-GU": "English (Guam)",
  "en-HK": "English (Hong Kong SAR China)",
  "en-IN": "English (India)",
  "en-IE": "English (Ireland)",
  "en-JM": "English (Jamaica)",
  "en-MT": "English (Malta)",
  "en-MH": "English (Marshall Islands)",
  "en-MU": "English (Mauritius)",
  "en-NA": "English (Namibia)",
  "en-NZ": "English (New Zealand)",
  "en-MP": "English (Northern Mariana Islands)",
  "en-PK": "English (Pakistan)",
  "en-PH": "English (Philippines)",
  "en-SG": "English (Singapore)",
  "en-ZA": "English (South Africa)",
  "en-TT": "English (Trinidad and Tobago)",
  "en-UM": "English (U.S. Minor Outlying Islands)",
  "en-VI": "English (U.S. Virgin Islands)",
  "en-GB": "English (United Kingdom)",
  "en-US": "English (United States)",
  "en-ZW": "English (Zimbabwe)",
  "et-EE": "Estonian (Estonia)",
  "ee-GH": "Ewe (Ghana)",
  "ee-TG": "Ewe (Togo)",
  "fo-FO": "Faroese (Faroe Islands)",
  "fil-PH": "Filipino (Philippines)",
  "fi-FI": "Finnish (Finland)",
  "fr-BE": "French (Belgium)",
  "fr-BJ": "French (Benin)",
  "fr-BF": "French (Burkina Faso)",
  "fr-BI": "French (Burundi)",
  "fr-CM": "French (Cameroon)",
  "fr-CA": "French (Canada)",
  "fr-CF": "French (Central African Republic)",
  "fr-TD": "French (Chad)",
  "fr-KM": "French (Comoros)",
  "fr-CG": "French (Congo - Brazzaville)",
  "fr-CD": "French (Congo - Kinshasa)",
  "fr-CI": "French (Côte d’Ivoire)",
  "fr-DJ": "French (Djibouti)",
  "fr-GQ": "French (Equatorial Guinea)",
  "fr-FR": "French (France)",
  "fr-GA": "French (Gabon)",
  "fr-GP": "French (Guadeloupe)",
  "fr-GN": "French (Guinea)",
  "fr-LU": "French (Luxembourg)",
  "fr-MG": "French (Madagascar)",
  "fr-ML": "French (Mali)",
  "fr-MQ": "French (Martinique)",
  "fr-MC": "French (Monaco)",
  "fr-NE": "French (Niger)",
  "fr-RW": "French (Rwanda)",
  "fr-RE": "French (Réunion)",
  "fr-BL": "French (Saint Barthélemy)",
  "fr-MF": "French (Saint Martin)",
  "fr-SN": "French (Senegal)",
  "fr-CH": "French (Switzerland)",
  "fr-TG": "French (Togo)",
  "ff-SN": "Fulah (Senegal)",
  "gl-ES": "Galician (Spain)",
  "lg-UG": "Ganda (Uganda)",
  "ka-GE": "Georgian (Georgia)",
  "de-AT": "German (Austria)",
  "de-BE": "German (Belgium)",
  "de-DE": "German (Germany)",
  "de-LI": "German (Liechtenstein)",
  "de-LU": "German (Luxembourg)",
  "de-CH": "German (Switzerland)",
  "el-CY": "Greek (Cyprus)",
  "el-GR": "Greek (Greece)",
  "gu-IN": "Gujarati (India)",
  "guz-KE": "Gusii (Kenya)",
  "ha-Latn-GH": "Hausa (Latin, Ghana)",
  "ha-Latn-NE": "Hausa (Latin, Niger)",
  "ha-Latn-NG": "Hausa (Latin, Nigeria)",
  "haw-US": "Hawaiian (United States)",
  "he-IL": "Hebrew (Israel)",
  "hi-IN": "Hindi (India)",
  "hu-HU": "Hungarian (Hungary)",
  "is-IS": "Icelandic (Iceland)",
  "ig-NG": "Igbo (Nigeria)",
  "id-ID": "Indonesian (Indonesia)",
  "ga-IE": "Irish (Ireland)",
  "it-IT": "Italian (Italy)",
  "it-CH": "Italian (Switzerland)",
  "ja-JP": "Japanese (Japan)",
  "kea-CV": "Kabuverdianu (Cape Verde)",
  "kab-DZ": "Kabyle (Algeria)",
  "kl-GL": "Kalaallisut (Greenland)",
  "kln-KE": "Kalenjin (Kenya)",
  "kam-KE": "Kamba (Kenya)",
  "kn-IN": "Kannada (India)",
  "kk-Cyrl-KZ": "Kazakh (Cyrillic, Kazakhstan)",
  "km-KH": "Khmer (Cambodia)",
  "ki-KE": "Kikuyu (Kenya)",
  "rw-RW": "Kinyarwanda (Rwanda)",
  "kok-IN": "Konkani (India)",
  "ko-KR": "Korean (South Korea)",
  "khq-ML": "Koyra Chiini (Mali)",
  "ses-ML": "Koyraboro Senni (Mali)",
  "lag-TZ": "Langi (Tanzania)",
  "lv-LV": "Latvian (Latvia)",
  "lt-LT": "Lithuanian (Lithuania)",
  "luo-KE": "Luo (Kenya)",
  "luy-KE": "Luyia (Kenya)",
  "mk-MK": "Macedonian (Macedonia)",
  "jmc-TZ": "Machame (Tanzania)",
  "kde-TZ": "Makonde (Tanzania)",
  "mg-MG": "Malagasy (Madagascar)",
  "ms-BN": "Malay (Brunei)",
  "ms-MY": "Malay (Malaysia)",
  "ml-IN": "Malayalam (India)",
  "mt-MT": "Maltese (Malta)",
  "gv-GB": "Manx (United Kingdom)",
  "mr-IN": "Marathi (India)",
  "mas-KE": "Masai (Kenya)",
  "mas-TZ": "Masai (Tanzania)",
  "mer-KE": "Meru (Kenya)",
  "mfe-MU": "Morisyen (Mauritius)",
  "naq-NA": "Nama (Namibia)",
  "ne-IN": "Nepali (India)",
  "ne-NP": "Nepali (Nepal)",
  "nd-ZW": "North Ndebele (Zimbabwe)",
  "nb-NO": "Norwegian Bokmål (Norway)",
  "nn-NO": "Norwegian Nynorsk (Norway)",
  "nyn-UG": "Nyankole (Uganda)",
  "or-IN": "Oriya (India)",
  "om-ET": "Oromo (Ethiopia)",
  "om-KE": "Oromo (Kenya)",
  "ps-AF": "Pashto (Afghanistan)",
  "fa-AF": "Persian (Afghanistan)",
  "fa-IR": "Persian (Iran)",
  "pl-PL": "Polish (Poland)",
  "pt-BR": "Portuguese (Brazil)",
  "pt-GW": "Portuguese (Guinea-Bissau)",
  "pt-MZ": "Portuguese (Mozambique)",
  "pt-PT": "Portuguese (Portugal)",
  "pa-Arab-PK": "Punjabi (Arabic, Pakistan)",
  "pa-Guru-IN": "Punjabi (Gurmukhi, India)",
  "ro-MD": "Romanian (Moldova)",
  "ro-RO": "Romanian (Romania)",
  "rm-CH": "Romansh (Switzerland)",
  "rof-TZ": "Rombo (Tanzania)",
  "ru-MD": "Russian (Moldova)",
  "ru-RU": "Russian (Russia)",
  "ru-UA": "Russian (Ukraine)",
  "rwk-TZ": "Rwa (Tanzania)",
  "saq-KE": "Samburu (Kenya)",
  "sg-CF": "Sango (Central African Republic)",
  "seh-MZ": "Sena (Mozambique)",
  "sr-Cyrl-BA": "Serbian (Cyrillic, Bosnia and Herzegovina)",
  "sr-Cyrl-ME": "Serbian (Cyrillic, Montenegro)",
  "sr-Cyrl-RS": "Serbian (Cyrillic, Serbia)",
  "sr-Latn-BA": "Serbian (Latin, Bosnia and Herzegovina)",
  "sr-Latn-ME": "Serbian (Latin, Montenegro)",
  "sr-Latn-RS": "Serbian (Latin, Serbia)",
  "sn-ZW": "Shona (Zimbabwe)",
  "ii-CN": "Sichuan Yi (China)",
  "si-LK": "Sinhala (Sri Lanka)",
  "sk-SK": "Slovak (Slovakia)",
  "sl-SI": "Slovenian (Slovenia)",
  "xog-UG": "Soga (Uganda)",
  "so-DJ": "Somali (Djibouti)",
  "so-ET": "Somali (Ethiopia)",
  "so-KE": "Somali (Kenya)",
  "so-SO": "Somali (Somalia)",
  "es-AR": "Spanish (Argentina)",
  "es-BO": "Spanish (Bolivia)",
  "es-CL": "Spanish (Chile)",
  "es-CO": "Spanish (Colombia)",
  "es-CR": "Spanish (Costa Rica)",
  "es-DO": "Spanish (Dominican Republic)",
  "es-EC": "Spanish (Ecuador)",
  "es-SV": "Spanish (El Salvador)",
  "es-GQ": "Spanish (Equatorial Guinea)",
  "es-GT": "Spanish (Guatemala)",
  "es-HN": "Spanish (Honduras)",
  "es-419": "Spanish (Latin America)",
  "es-MX": "Spanish (Mexico)",
  "es-NI": "Spanish (Nicaragua)",
  "es-PA": "Spanish (Panama)",
  "es-PY": "Spanish (Paraguay)",
  "es-PE": "Spanish (Peru)",
  "es-PR": "Spanish (Puerto Rico)",
  "es-ES": "Spanish (Spain)",
  "es-US": "Spanish (United States)",
  "es-UY": "Spanish (Uruguay)",
  "es-VE": "Spanish (Venezuela)",
  "sw-KE": "Swahili (Kenya)",
  "sw-TZ": "Swahili (Tanzania)",
  "sv-FI": "Swedish (Finland)",
  "sv-SE": "Swedish (Sweden)",
  "gsw-CH": "Swiss German (Switzerland)",
  "shi-Latn-MA": "Tachelhit (Latin, Morocco)",
  "shi-Tfng-MA": "Tachelhit (Tifinagh, Morocco)",
  "dav-KE": "Taita (Kenya)",
  "ta-IN": "Tamil (India)",
  "ta-LK": "Tamil (Sri Lanka)",
  "te-IN": "Telugu (India)",
  "teo-KE": "Teso (Kenya)",
  "teo-UG": "Teso (Uganda)",
  "th-TH": "Thai (Thailand)",
  "bo-CN": "Tibetan (China)",
  "bo-IN": "Tibetan (India)",
  "ti-ER": "Tigrinya (Eritrea)",
  "ti-ET": "Tigrinya (Ethiopia)",
  "to-TO": "Tonga (Tonga)",
  "tr-TR": "Turkish (Turkey)",
  "uk-UA": "Ukrainian (Ukraine)",
  "ur-IN": "Urdu (India)",
  "ur-PK": "Urdu (Pakistan)",
  "uz-Arab-AF": "Uzbek (Arabic, Afghanistan)",
  "uz-Cyrl-UZ": "Uzbek (Cyrillic, Uzbekistan)",
  "uz-Latn-UZ": "Uzbek (Latin, Uzbekistan)",
  "vi-VN": "Vietnamese (Vietnam)",
  "vun-TZ": "Vunjo (Tanzania)",
  "cy-GB": "Welsh (United Kingdom)",
  "yo-NG": "Yoruba (Nigeria)",
  "zu-ZA": "Zulu (South Africa)"
};

class LocaleSelector extends ReactiveElement {
  [internal.componentDidMount]() {
    if (super[internal.componentDidMount]) {
      super[internal.componentDidMount]();
    }
    this[internal.ids].select.addEventListener("change", () => {
      this[internal.raiseChangeEvents] = true;
      this.value = /** @type {any} */ (this[internal.ids].select).value;
      this[internal.raiseChangeEvents] = false;
    });
  }

  [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
    if (changed.value && this[internal.raiseChangeEvents]) {
      const event = new CustomEvent("change", {
        detail: {
          value: this[internal.state].value
        }
      });
      this.dispatchEvent(event);
    }
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      value: navigator.language
    });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.value) {
      const value = this[internal.state].value;
      /** @type {HTMLSelectElement} */ (this[
        internal.ids
      ].select).value = value;
    }
  }

  get [internal.template]() {
    const result = template.html`
      <style>
        :host {
          display: inline-block;
        }
      </style>
      <select id="select"></select>
    `;
    // Create options for all locales.
    const localeOptions = Object.keys(locales).map(locale => {
      const option = document.createElement("option");
      option.value = locale;
      option.disabled = !localeSupported(locale);
      option.textContent = locales[locale];
      return option;
    });
    const select = result.content.getElementById("select");
    if (select) {
      applyChildNodes(select, localeOptions);
    }
    return result;
  }

  get value() {
    return this[internal.state].value;
  }
  set value(value) {
    this[internal.setState]({ value });
  }
}

/**
 * Heuristic that returns true if the given locale is supported.
 *
 * @private
 * @param {string} locale
 */
function localeSupported(locale) {
  const language = locale.split("-")[0];
  if (language === "en") {
    // Assume all flavors of English are supported.
    return true;
  }
  // Try formatting a Tuesday date, and if we get the English result "Tue",
  // the browser probably doesn't support the locale, and used the default
  // locale instead.
  const date = new Date("10 March 2015"); // A Tuesday
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const result = formatter.format(date);
  return result !== "Tue";
}

export default LocaleSelector;
customElements.define("locale-selector", LocaleSelector);

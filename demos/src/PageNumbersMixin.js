import { merge } from '../../src/updates.js';


const inject = Symbol('inject');


function PageNumbersMixin(Base) {

  class PageNumbers extends Base {

    [inject](template) {
      return `
        <style>
          #page {
            bottom: 0;
            color: white;
            padding: 0.5em;
            position: absolute;
            right: 0;
          }
        </style>
        <div id="pageNumbers" role="none" style="display: flex; flex: 1; overflow: hidden;">
          <div role="none" style="display: flex; flex: 1; overflow: hidden; position: relative;">
            ${template}
          </div>
          <div id="page"></div>
        </div>
      `;
    }

    get updates() {
      const textContent = this.state.selectedIndex >= 0 && this.items ?
        `${this.state.selectedIndex + 1} / ${this.items.length}` :
        '';
      return merge(super.updates, {
        $: {
          page: {
            textContent
          }
        }
      });
    }

  }

  return PageNumbers;
}


PageNumbersMixin.inject = inject;


export default PageNumbersMixin;

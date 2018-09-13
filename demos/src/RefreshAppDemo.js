import '../../src/PullToRefresh';
import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import ReactiveElement from '../../src/ReactiveElement.js';
import { merge } from '../../src/updates';


const defaultTexts = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie molestie enim porta dapibus. Phasellus dolor quam, egestas eu viverra at, porttitor in diam. Donec risus tellus, accumsan eget ipsum sed, vestibulum blandit ante. Nullam rhoncus leo nec lobortis convallis. Donec posuere tellus a nibh dignissim, rhoncus viverra neque rutrum. Suspendisse rutrum at massa vitae venenatis. Suspendisse ut risus pellentesque lacus dictum aliquet. Cras a arcu id odio molestie imperdiet.`,
  `Pellentesque vitae eros ac nulla aliquam eleifend. Nunc ornare sollicitudin arcu id suscipit. Donec sed nisl libero. Nulla facilisi. Proin ornare feugiat molestie. Mauris velit mi, volutpat sit amet posuere quis, tristique et urna. Donec sit amet tellus magna. Aenean feugiat suscipit neque, ut porttitor diam auctor in. Sed faucibus finibus ipsum et pharetra. In hac habitasse platea dictumst. Cras facilisis justo eu lectus luctus, et interdum velit aliquet.`,
  `Aliquam vitae nulla efficitur turpis viverra placerat. Mauris fermentum tellus vel elementum aliquet. Integer vitae arcu et mi tristique lacinia. Cras placerat ultrices velit, id interdum ipsum commodo efficitur. Maecenas maximus odio a nisi dapibus, non dapibus nisl venenatis. Morbi tristique interdum leo, non tincidunt sapien efficitur ac. Nunc hendrerit turpis eget enim rhoncus sagittis. Aenean ac euismod magna. Phasellus et posuere nisi.`,
  `Ut volutpat eget massa id viverra. Maecenas accumsan euismod lorem, ac tristique urna efficitur non. Cras ornare ultricies arcu eu dignissim. Curabitur varius ante eget arcu accumsan, ut lacinia lacus dignissim. Ut pellentesque nibh efficitur venenatis gravida. Phasellus varius lacus non ultricies imperdiet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.`,
  `Efficitur nisl vel metus vestibulum, quis rutrum sapien rutrum. Suspendisse non mi varius, tincidunt mauris non, dignissim odio. Proin aliquam eleifend vestibulum. Mauris porttitor neque vel ullamcorper suscipit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus accumsan luctus commodo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque quis enim vel tortor molestie rhoncus ac eu eros.`,
  `Praesent semper turpis vel tortor lacinia accumsan. Cras facilisis varius leo, a pretium odio ultrices eget. Nunc felis leo, aliquam sit amet lobortis rutrum, lobortis porttitor dolor. Sed nisl lacus, placerat ac enim id, rhoncus molestie turpis. Aenean nibh justo, ultrices quis mollis id, semper a risus. Cras magna ipsum, sollicitudin ut pretium sed, ultricies at ante. Integer ultricies quis elit in efficitur. Nam ac felis sollicitudin, tincidunt lorem sit amet, convallis ligula.`,
  `Nam imperdiet id purus quis rutrum. Phasellus laoreet efficitur lorem, eu commodo tortor pretium sit amet. Etiam volutpat ex ac ex luctus maximus. Praesent in pharetra nunc, sed rhoncus eros. Nulla facilisi. Aenean commodo volutpat feugiat. Pellentesque egestas nulla ut facilisis efficitur. Praesent maximus diam ut suscipit mattis. Aenean eros turpis, vestibulum id sem vitae, suscipit molestie justo.`,
  `Nulla iaculis varius arcu, et rhoncus est lobortis et. Etiam convallis, velit ut tincidunt molestie, enim erat malesuada nunc, et ornare tortor velit et mi. Quisque nec felis nulla. Mauris sit amet nisi quis sapien pharetra tempor. Aenean fringilla nulla urna, sed tristique ipsum vulputate a. Ut lacus diam, volutpat id tincidunt a, condimentum eu odio. Nam justo orci, consectetur vitae nulla a, sagittis vestibulum erat. Mauris fringilla urna est, sit amet rutrum nulla facilisis a.`,
  `Sed in nulla eu nisl consectetur semper. Aliquam tristique ligula eu maximus porttitor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam tempor sed ex sit amet egestas. Curabitur sapien est, rhoncus dignissim pharetra sit amet, viverra id lectus. Vestibulum semper leo porta mi viverra consectetur. Quisque imperdiet lectus eget volutpat bibendum. Vivamus in nunc enim. Morbi fringilla est velit.`,
  `Proin malesuada pharetra sapien, vitae blandit ante ultricies vitae. Curabitur tempus urna malesuada mauris pharetra feugiat. Duis augue nunc, porta et lorem dictum, interdum pellentesque risus. Donec leo dolor, sollicitudin a nunc non, consectetur interdum risus. Pellentesque feugiat magna libero, quis sollicitudin leo elementum in. Etiam urna risus, congue id placerat eu, fringilla lobortis diam. Sed id auctor nisi. Nunc sed ex eu neque sodales pharetra sit amet non libero.`,
];


class RefreshAppDemo extends ReactiveElement {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.pullToRefresh.addEventListener('refreshing-changed', event => {
      if (event.detail.refreshing) {
        this.refresh();
      }
    });
  }

  get defaultState() {
    const texts = defaultTexts;
    const paragraphs = createParagraphs(texts);
    return Object.assign({}, super.defaultState, {
      paragraphs,
      texts
    });
  }

  refresh() {
    setTimeout(async () => {
      await playSound(this.$.refreshSound);
      this.$.pullToRefresh.refreshing = false;
      // Shuffle all text but first one, move first text to last place.
      const first = this.state.texts[0];
      const remainder = this.state.texts.slice(1);
      shuffle(remainder);
      const texts = [...remainder, first];
      const paragraphs = createParagraphs(texts);
      this.setState({
        texts,
        paragraphs
      });
    }, 1000);
  }

  get [symbols.template]() {
    return template.html`
      <style>
        #pullToRefresh {
          padding: 1em;
        }

        p {
          border-top: 1px solid #ccc;
          margin: 1em 0;
          padding-top: 0.75em;
        }

        p:first-of-type {
          border-top: none;
          margin-top: 0;
          padding-top: 0;
        }

        p:last-of-type {
          margin-bottom: 0;
        }
      </style>
      <elix-pull-to-refresh id="pullToRefresh"></elix-pull-to-refresh>
      <audio id="refreshSound" src="pop.mp3"></audio>
    `;
  }

  get updates() {
    return merge(super.updates, {
      $: {
        pullToRefresh: {
          childNodes: this.state.paragraphs
        }
      }
    });
  }

}


function createParagraphs(texts) {
  const paragraphs = texts.map(text => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
  });
  Object.freeze(paragraphs);
  return paragraphs;
}


async function playSound(sound) {
  if (sound && sound.play) {
    try {
      await sound.play();
    } catch (e) {
      if (e.name === 'NotAllowedError') {
        // Webkit doesn't want to play sounds
      } else {
        throw e;
      }
    }
  }
}


/*
 * Shuffle an array.
 * 
 * Performs a Fisher-Yates shuffle. From http://sedition.com/perl/javascript-fy.html
 */
function shuffle(array) {
  var i = array.length;
  while (--i >= 0) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};


customElements.define('refresh-app-demo', RefreshAppDemo);
export default RefreshAppDemo;

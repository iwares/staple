import { Interaction } from 'staple/interaction'

import { interaction as snippet_about_interaction } from 'staple/snippets!htmls/about'

export default class HomeInteraction extends Interaction {

    onCreate (state) {
        super.onCreate(state);
        this.setContent(snippet_about_interaction);
## IF jQuery ##
        this.find('#version').text(this.application.meta['version-name']);
## ELSE ##
        this.selectOne('#version').innerText = this.application.meta['version-name'];
## FI jQuery ##
    }

}

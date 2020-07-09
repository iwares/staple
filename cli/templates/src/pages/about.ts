/// <reference path="../../staple.d.ts"/>

import { Interaction } from 'staple/interaction'

import { interaction as snippet_about_interaction } from 'staple/snippets!./about'

export default class HomeInteraction extends Interaction {

    onCreate (state: { [key:string]: any}): void {
        super.onCreate(state);
        this.setContent(snippet_about_interaction);
## IF jQuery ##
        this.find('#version').text(this.application.meta['version-name']);
## ELSE ##
        this.selectOne('#version').innerText = this.application.meta['version-name'];
## FI jQuery ##
    }

}

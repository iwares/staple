/**
 * file: js/main/home.js
 */
import { Interaction } from 'staple/interaction'
import { interaction as snippet_home_interaction } from 'staple/snippets!res/htmls/home'

export default class HomeInteraction extends Interaction {

	onCreate (state) {
		super.onCreate();
		this.setContent(snippet_home_interaction);
	}

	onSaveInstanceState (state) {
		super.onSaveInstanceState(state);
		state.text = this.selectOne('p').innerText;
	}

	onRestoreInstanceState (state) {
		super.onRestoreInstanceState(state);
		this.selectOne('p').innerText = state.text;
	}

	onEditClick (button) {
		var text = this.selectOne('p').innerText;
		var extra = { text : text }
		this.startInteraction('js/main/input', extra, 'edit');
	}

	onInteractionResult (request, result, data) {
		switch(request) {
		case 'edit':
			if (result != 'OK')
				break;
			this.selectOne('p').innerText = data.text;
			break;
		default:
			super.onInteractionResult(request, result, data);
			break;
		}
	}

}

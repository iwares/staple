/**
 * file: js/main/input.js
 */
import { Interaction } from 'staple/interaction'
import { interaction as snippet_input_interaction } from 'staple/snippets!res/htmls/input'

export default class InputInteraction extends Interaction {

	onCreate (state) {
		super.onCreate(state);
		this.setContent(snippet_input_interaction);

		var input = this.selectOne("#input");
		input.value = this.getExtra().text;
	}

	onSaveInstanceState (state) {
		super.onSaveInstanceState(state);
		var input = this.selectOne("#input");
		state.input = input.value;
	}

	onRestoreInstanceState (state) {
		super.onRestoreInstanceState(state);
		var input = this.selectOne("#input");
		input.value = state.input;
	}

	onCancelClick (el) {
		this.finish();
	}

	onOkClick(el) {
		var input = this.selectOne("#input");
		this.setResult('OK', { text : input.value});
		this.finish();
	}

}

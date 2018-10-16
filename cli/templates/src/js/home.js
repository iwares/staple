import { Interaction } from 'staple/interaction'
import { MessageDialog } from 'js/dialogs/message-dialog';

import { interaction as snippet_home_interaction } from 'staple/snippets!htmls/home'

import Strings from 'staple/nls!strings'

export default class HomeInteraction extends Interaction {

	onCreate (state) {
		super.onCreate(state);
		this.setContent(snippet_home_interaction);

## IF jQuery ##
        this.find('#quit').click(this.showQuitDialog.bind(this));
## ELSE ##
        this.selectOne('#quit').onclick = this.showQuitDialog.bind(this);
## FI jQuery ##
	}

	showAbout () {
		this.startInteraction('js/about');
	}

	showQuitDialog () {
		let dialog = this.quitDialog;
		if (!dialog) {
			dialog = new MessageDialog(this, {
				title: Strings.text_quit,
				message: Strings.text_are_you_sure,
				positive: Strings.btn_quit,
				negative: Strings.btn_cancel,
			});
			dialog.onButtonClick = this.onQuitDialogButtonClick.bind(this);
			dialog.cancelable = dialog.cancelOnTouchOutside = true;
		}
		dialog.show();
	}

	onQuitDialogButtonClick (dialog, button) {
		if (button != 'positive')
			return true;
		this.finish();
		return true;
	}

}

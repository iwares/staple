/// <reference path="../../staple.d.ts"/>

import { Interaction } from 'staple/interaction'
import { MessageDialog } from 'components/message-dialog';

import { interaction as snippet_home_interaction } from 'staple/snippets!./home'

import Strings from 'staple/nls!strings'

export default class HomeInteraction extends Interaction {

	private quitDialog: MessageDialog;

	onCreate (state: object): void {
		super.onCreate(state);
		this.setContent(snippet_home_interaction);

## IF jQuery ##
        this.find('#quit').click(this.showQuitDialog.bind(this));
## ELSE ##
        this.selectOne('#quit').onclick = this.showQuitDialog.bind(this);
## FI jQuery ##
	}

	showAbout (): void {
		this.startInteraction('pages/about');
	}

	showQuitDialog (): void {
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

	onQuitDialogButtonClick (_dialog: MessageDialog, button: string): boolean {
		if (button != 'positive')
			return true;
		this.finish();
		return true;
	}

}

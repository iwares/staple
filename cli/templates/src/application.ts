/// <reference path="../staple.d.ts"/>

import { Application as BaseApplication } from 'staple/application'
## IF jQuery ##
import { Interaction } from 'staple/interaction'
import { Aside } from 'staple/aside'
import { Dialog } from 'staple/dialog'
import { Popup } from 'staple/popup'
import { Toast } from 'staple/toast'

const sym_root = Symbol('jquery: root');

function find (selector: string): JQuery<HTMLElement> {
	if (!this[sym_root])
		this[sym_root] = $(this.selectOne('$root'));
	return this[sym_root].find(selector);
}

Interaction.prototype.find = Aside.prototype.find = Dialog.prototype.find = Popup.prototype.find = Toast.prototype.find = find;
## ELSE ##
## FI jQuery ##

export class Application extends BaseApplication {

	onCreate (): void {
		super.onCreate();
	}

}

export default Application;

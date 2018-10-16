/// <reference path="../../../staple.d.ts"/>

import { Interaction } from 'staple/interaction'
import { Dialog } from 'staple/dialog'

import { dialog as snippet_message_dialog } from 'staple/snippets!/htmls/dialogs/message-dialog';

interface Config {
    title?: string;
    message: string;
    positive?: string;
    negative?: string;
}

export class MessageDialog extends Dialog {

## IF jQuery ##
    private title: JQuery<HTMLElement>;
    private message: JQuery<HTMLElement>;
    private buttons: JQuery<HTMLElement>;
    private positive: JQuery<HTMLElement>;
    private negative: JQuery<HTMLElement>;
## ELSE ##
    private title: HTMLElement;
    private message: HTMLElement;
    private buttons: HTMLElement;
    private positive: HTMLElement;
    private negative: HTMLElement;
## FI jQuery ##

    constructor (interaction: Interaction, config: Config) {
        super(interaction, snippet_message_dialog);
## IF jQuery ##
        this.title = this.find('#title').remove();
        this.message = this.find('#message');
        this.buttons = this.find('#buttons').delegate('.btn', 'click', this.handleButtonClick.bind(this));
        this.positive = this.find('#positive').remove();
        this.negative = this.find('#negative').remove();
## ELSE ##
        this.title = this.selectOne('#title');
        this.title.remove();
        this.message = this.selectOne('#message');
        this.buttons = this.selectOne('#buttons');
        this.positive = this.selectOne('#positive');
        this.negative = this.selectOne('#negative');
        this.positive.onclick = this.negative.onclick = this.handleButtonClick.bind(this);
        this.positive.remove();
        this.negative.remove();
## FI jQuery ##
        this.setConfig(config);
    }

    setConfig (config: Config): void {
        this.setTitle(config.title);
        this.setMessage(config.message);
        this.setPositive(config.positive);
        this.setNegative(config.negative);
    }

    setTitle (title: string): void {
        if (title) {
## IF jQuery ##
            this.title.insertBefore(this.message).find('strong').text(title);
## ELSE ##
            this.message.parentElement.insertBefore(this.title, this.message);
            (<HTMLElement> this.title.firstElementChild).innerText = title;
## FI jQuery ##
        } else {
            this.title.remove();
        }
    }

    setMessage (message: string): void {
## IF jQuery ##
        this.message.text(message);
## ELSE ##
        this.message.innerText = message;
## FI jQuery ##
    }

    setPositive (positive: string): void {
## IF jQuery ##
        let previous: string = this.positive.text();
        this.positive.text(positive);
## ELSE ##
        let previous: string = this.positive.innerText;
        this.positive.innerText = positive;
## FI jQuery ##
        if (!!previous == !!positive)
            return;
        this.updateButtons();
    }

    setNegative (negative: string): void {
## IF jQuery ##
        let previous: string = this.negative.text();
        this.negative.text(negative);
## ELSE ##
        let previous: string = this.negative.innerText;
        this.negative.innerText = negative;
## FI jQuery ##
        if (!!previous == !!negative)
            return;
        this.updateButtons();
    }

    private updateButtons (): void {
        this.negative.remove();
        this.positive.remove();
## IF jQuery ##
        if (this.negative.text())
            this.negative.appendTo(this.buttons);
        if (this.positive.text())
            this.positive.appendTo(this.buttons);
## ELSE ##
        if (this.negative.innerText)
            this.buttons.appendChild(this.negative);
        if (this.positive.innerText)
            this.buttons.appendChild(this.positive);
## FI jQuery ##
    }

    private handleButtonClick (event: Event): void {
        let button: Element = <Element> event.currentTarget;
        if (!this.onButtonClick(this, button.id))
            return;
        this.dismiss();
    }

    onButtonClick (dialog: MessageDialog, button: string): boolean {
        console.warn('MessageDialog button clicked!', dialog, button);
        return false;
    }

}

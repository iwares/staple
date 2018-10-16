import { Interaction } from 'staple/interaction'
import { Dialog } from 'staple/dialog'

import { dialog as snippet_message_dialog } from 'staple/snippets!/htmls/dialogs/message-dialog';

export class MessageDialog extends Dialog {

    constructor (interaction, config) {
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

    setConfig (config) {
        this.setTitle(config.title);
        this.setMessage(config.message);
        this.setPositive(config.positive);
        this.setNegative(config.negative);
    }

    setTitle (title) {
        if (title) {
## IF jQuery ##
            this.title.insertBefore(this.message).find('strong').text(title);
## ELSE ##
            this.message.parentElement.insertBefore(this.title, this.message);
            this.title.firstElementChild.innerText = title;
## FI jQuery ##
        } else {
            this.title.remove();
        }
    }

    setMessage (message) {
## IF jQuery ##
        this.message.text(message);
## ELSE ##
        this.message.innerText = message;
## FI jQuery ##
    }

    setPositive (positive) {
## IF jQuery ##
        let previous = this.positive.text();
        this.positive.text(positive);
## ELSE ##
        let previous = this.positive.innerText;
        this.positive.innerText = positive;
## FI jQuery ##
        if (!!previous == !!positive)
            return;
        this.updateButtons();
    }

    setNegative (negative) {
## IF jQuery ##
        let previous = this.negative.text();
        this.negative.text(negative);
## ELSE ##
        let previous = this.negative.innerText;
        this.negative.innerText = negative;
## FI jQuery ##
        if (!!previous == !!negative)
            return;
        this.updateButtons();
    }

    updateButtons () {
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

    handleButtonClick (event) {
        let button = event.currentTarget;
        if (!this.onButtonClick(this, button.id))
            return;
        this.dismiss();
    }

    onButtonClick (dialog, button) {
        console.warn('MessageDialog button clicked!', dialog, button);
        return false;
    }

}

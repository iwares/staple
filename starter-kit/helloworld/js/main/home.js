/**
 * file: js/main/home.js
 */
define(function (require, exports, module) {

var Interaction = require('staple/interaction');

return Class.create(Interaction, {

	onCreate : function ($super, state) {
		$super(state);
		this.setContent(require('snippet!res/htmls/home#interaction'));
	},

	onEditClick : function (button) {
		var text = this.selectOne('p').innerText;
		var extra = { text : text }
		this.startInteraction('js/main/input', extra, 'edit');
	},

	onInteractionResult : function ($super, request, result, data) {
		switch(request) {
		case 'edit':
			if (result != 'OK')
				break;
			this.selectOne('p').innerText = data.text;
			break;
		default:
			$super(request, result, data);
			break;
		}
	},

});

});

/**
 * file: js/main/input.js
 */
define(function (require, exports, module) {

var Interaction = require('staple/interaction');

return Class.create(Interaction, {

	onCreate : function ($super, state) {
		$super(state);
		this.setContent(require('snippet!res/htmls/input#interaction'));

		var input = this.selectOne("#input");
		input.value = this.getExtra().text;
	},

	onCancelClick : function (el) {
		this.finish();
	},

	onOkClick : function(el) {
		var input = this.selectOne("#input");
		this.setResult('OK', { text : input.value});
		this.finish();
	},

});

});
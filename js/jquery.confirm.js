(function($){
	$.fn.ConfirmUI = function(msg, callbackFnc, options){
		var element = $(this[0]);
		var value   = $(element).val();
		var divId =  element.attr('id');
		var settings = $.extend({
				idTest: 'default',
				height:140,
				resizable: false,
				modal:true,
				overlay: {
					opacity: 0.5,
					background:"black"
				},
				buttonFalse: 'Não',
				buttonTrue: 'Sim'
			}, options||{}
		);
		divId = divId +'-'+settings.idTest+'-'+ 909099;
		if($('#'+divId).length == 0){
			dialogBox = $('<div />')
				.append(msg)
				.attr('ignoreValue', '')
				.attr('id', divId);
			$('body').append(dialogBox);
		} else {
			dialogBox = $('#'+divId);
			dialogBox.empty();
			dialogBox.append(msg);
		}
		var ignoreValue = dialogBox.attr('ignoreValue');
		return (function(){
			if(value == ignoreValue) return true;
			if(typeof callbackFnc == 'function'){
				retcode = callbackFnc.call(this,element);
				if(retcode){
					dialogBox.hide();
					ignoreValue = $(element).val();
					$(dialogBox).attr('ignoreValue', ignoreValue);
					return true
				}
				//else
				confirmDialogUI(dialogBox, function (shouldIgnore){
					if(shouldIgnore){
						ignoreValue = $(element).val();
						$(dialogBox).attr('ignoreValue', ignoreValue);
						$(element).valid();
					}else{
						$(dialogBox).attr('ignoreValue', '');
					}
				}, settings);
			}
			return false;
		}());
	};
	//Private functions
	function confirmDialogUI(dgb, callbackFnc ,options){
		var settings = $.extend({
				height:140,
				resizable: false,
				modal:true,
				overlay: {
					opacity: 0.5,
					background:"black"
				},
				buttonFalse: 'Não',
				buttonTrue: 'Sim'
			}, options||{}
		);
		if(typeof callbackFnc == 'function'){
			dgb.dialog('destroy');
			dgb.dialog({
				height: settings.height,
				resizable: settings.resizable,
				overlay: settings.overlay,
				modal: settings.modal,
				buttons:{
					'Nao': function(){
						$(this).dialog('close');
						$(this).hide()
						callbackFnc.call(this, false);
					},
					'Sim': function(){
						$(this).dialog('close');
						$(this).hide()
						callbackFnc.call(this, true);
					}
				}
			});
		}
		return true;
	};
})(jQuery);

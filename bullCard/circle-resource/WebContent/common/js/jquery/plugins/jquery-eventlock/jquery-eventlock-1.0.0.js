/**
 * 目标:
 *      对BUTTON/A事件进行控制,页面同步时,在返回前自动解锁,异步时,需要手动解锁
 * //TODO: 锁定状态的CSS样式待确定
 *
 * @author Longer
 * @date   2015-05-28
 */
(function($) {
    /**
     * 是否已锁
     * @returns {boolean}
     */
	$.fn.isLocked = function(){
		var isLocked = false;
        if($(this).hasClass("ui-button-disable")){
            console.debug("JS事件锁状态:" + isLocked);
            return true;
        }
        console.debug("JS事件锁状态:" + isLocked);
		return isLocked;
	}

    /**
     * 锁定
     */
    $.fn.lock = function(){
        var text={"en-US":"Waiting ...","zh-CN":"稍候...","zh-TW":"稍候..."};
        $(this).each( function(){
            var tagName = $(this).prop( "tagName" );//jquery1.6
            $(this).addClass( "ui-button-disable" );
        });
    }

    /**
     * 解锁
     */
    $.fn.unlock = function(){
		$(this).each( function(){
            var tagName = $(this).prop( "tagName" );//jquery1.6
            $(this).removeClass( "ui-button-disable" );

		});
	}
})(jQuery);

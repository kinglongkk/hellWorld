/**
 * Created by Kevice on 2015/1/22.
 */
(function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        define( ["jquery", "jqValidate"], factory );
    } else {
        factory( jQuery );
    }
}(function( $ ) {


    $.fn.formtip = function(message, second, option) {
        if (second == undefined)
            second = 3;
        $(".poshytip").remove();
        try {
            $(this).poshytip({
                className: 'poshytip',
                content: message,
                timeOnScreen: second * 1000,
                showOn: 'none',
                alignTo: 'target',
                alignX: 'inner-left',
                alignY: 'bottom',
                offsetX: 0,
                offsetY: 5 }).poshytip("show");
        } catch (e) {
            console.error(e);
        }
    }

}));

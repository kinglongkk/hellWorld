/**
 * 目标:
 *     生成uuid
 * @author Longer
 * @date   2015-09-09
 */
(function($) {
    /**
     * uuid
     */
    $.uuid = function(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },

    /**
     * 不带下划线
     */
    $.uuidShort = function(){
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + s4() + s4() +  s4() + s4() + s4() + s4();
        }
})(jQuery);

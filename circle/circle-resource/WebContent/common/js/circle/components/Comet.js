/**
 *
 */
define([], function() {

    return Class.extend({

        /** 请求参数名：同步 */
        SYNCHRONIZE_KEY : "_S_COMET",
        /** 同步值：创建连接 */
        CONNECTION_VALUE : "C",
        /** 同步值：断开连接 */
        DISCONNECT_VALUE : "D",
        /** 返回参数名：连接ID */
        CONNECTIONID_KEY : "_C_COMET",
        /** 请求参数名：消息订阅类型 */
        SUBSCRIBE_TYPE : "_S_TYPE",
        /** 同步值：消息订阅 */
        SUBSCRIBE_VALUE : "R",

        url : null,
        cid : null,
        accept : function(data) {
            var message;
            if(typeof(data)=="object"){
                message = data;
            }else{
                message = eval("(" + data + ")");
            }
            if(!(message._S_COMET&&message._S_COMET=="S")) {//只处理非连接超时消息。
                console.info("收到消息,消息内容为："+data);
                var subscribeType = message.subscribeType;
                $.each(comet.subscribes,function(i,val){
                    if(val.type==subscribeType){
                        console.info("收到订阅类型为"+subscribeType+"的消息，调用回调函数"+val.callBack+",入参为："+data);
                        val.callBack.call(comet,data);
                        return false;
                    }
                })
            }
        },
        /** 连接的语言类型参数名 */
        LOCALE_TYPE : "_LOCALE_TYPE",
        /** 连接的sessionID 参数名**/
        SESSION_KEY : "_SESSION_KEY",
        async : true,
        /** 是否在连接状态 */
        isConnect : false,
        /**订阅列表**/
        subscribes : [],
        /** 连接所需要传递的参数 **/
        userParam : {},
        /**连接成功后的回调函数**/
        successCallBack : function(){},
        /**连接失败后的回调函数**/
        failureCallBack : function(){},
        /**实例化后是否立即执行连接操作**/
        isImmediatelyConnect : false,
        /**
         * 构造器
         * @param props 参数对象
         */
        init : function(props) {
            this.url = props.url;
            if(props.async != undefined) {
                this.async = props.async;
            }
            if(props.accept != undefined) {
                this.accept = props.accept;
            }
            if(props.success != undefined) {
                this.successCallBack = props.success;
            }
            if(props.failure != undefined) {
                this.failureCallBack = props.failure;
            }
            if(props.failure != undefined) {
                this.isImmediatelyConnect = props.isImmediatelyConnect;
            }
            if(props.localeType != undefined) {
                this.userParam[this.LOCALE_TYPE] = props.localeType;
            }
            if(props.sessionKey != undefined) {
                this.userParam[this.SESSION_KEY] = props.sessionKey;
            }
            this.userParam[this.SYNCHRONIZE_KEY] = this.CONNECTION_VALUE;
            if(this.isImmediatelyConnect){
                this.connection();
            }
        },

        /**
         * 判断订阅类型是否已存在于订阅列表中
         * @param subscribeType 订阅类型对象 type 订阅类型（此类型可自定义），callBack 回调函数{type:type,callBack:callBack}
         * @returns {boolean} 返回此订阅类型是否已订阅
         */
        isSubscribed : function(subscribeObj){
            var flag = false;
            $.each(this.subscribes,function(i,val){
                if(val.type == subscribeObj.subscribeType && val.callBack.name == subscribeObj.callBack.name) {
                    flag = true;
                    return false;
                }
            });
            return flag;
        },
        /**
         *  获取订阅列表中所有订阅类型的type值，用逗号隔开
         * @returns {string} 已订阅的所有类型的type值
         */
        getSubscribeTypes : function(){
            var subscribeTypes = "";
            $.each(this.subscribes,function(i,val){
                subscribeTypes += val.type + ",";
            });
            if(subscribeTypes.length>0){
                subscribeTypes = subscribeTypes.substr(0, subscribeTypes.length - 1);
            }
            return subscribeTypes;
        },

        /**
         * 消息订阅
         * @param subscribeObj 订阅类型对象 type 订阅类型（此类型可自定义），callBack 回调函数{type:type,callBack:callBack}
         *
         */
        _genSubscribes :function(subscribeObj){
            var subscribed = this.isSubscribed(subscribeObj);
            if(!subscribed){
                var subscribe = {};
                subscribe.type = subscribeObj.subscribeType;
                subscribe.callBack = subscribeObj.callBack;
                this.subscribes.push(subscribe);
            }
        },
        subscribeMsg : function (subscribeType,callBack) {
            var subscribeObj = {subscribeType: subscribeType, callBack: callBack};
            this._genSubscribes(subscribeObj);
            this._subscribeMsg();
        },
        subscribeMsgs : function (subscribeArr) {
            var _this = this;
            $.each(subscribeArr,function(i,val){
                _this._genSubscribes(val);
            });
            _this._subscribeMsg();
        },
        _subscribeMsg : function(){
            var subscribeTypes = this.getSubscribeTypes();
            var userParam = {};
            userParam[this.SYNCHRONIZE_KEY] = this.SUBSCRIBE_VALUE;
            userParam[this.SUBSCRIBE_TYPE] = subscribeTypes;
            userParam[this.CONNECTIONID_KEY] = this.cid;
            var _this = this;
            window.top.topPage.ajax({
                type : 'GET',
                url : _this.url,
                data : userParam,
                crossDomain : true,
                comet:true,
                success : function(result) {
                    if (result=="success"){
                        console.info("订阅成功"+subscribeTypes);
                    }else {
                        console.info(result);
                    }
                }
            });
        },

        /**
         * 开始链接
         *
         * @param userParam 连接时传递给服务器端的参数
         * @param successCallBack 连接成功处理方法
         * @param failureCallBack 连接失败处理方法
         * @param caller 调用者
         */
        connection : function(caller) {
            var _this = this;
            window.top.topPage.ajax({
                type : 'POST',
                url : _this.url,
                data : _this.userParam,
                crossDomain : true,
                success : function(result) {
                    if(result){
                        var data = eval("(" + result + ")");
                        var cid = data[_this.CONNECTIONID_KEY];
                        caller = caller ? caller : null;
                        if (null == cid) { // 拒接连接
                            if (_this.failureCallBack) {
                                _this.failureCallBack.call(caller);
                            }
                        } else { // 连接成功
                            _this.cid = cid;
                            if (_this.successCallBack) {
                                _this.successCallBack.call(caller);
                            }
                            _this.isConnect = true;
                            _this.polling(cid);
                        }
                    }

                },
                error : function(param){
                    //连接失败后重试，10秒一次
                    setTimeout(function(){
                        _this.connection();
                    }, 10000);
                }
            });
        },

        /** 轮询 */
        polling : function(cid) {
            if (!this.isConnect) {
                return;
            }
            var param = {};
            param[this.CONNECTIONID_KEY] = cid;
            var _this = this;
            window.top.topPage.ajax({
                type : 'GET',
                url : _this.url,
                data : param,
                //crossDomain : true,
                success : function(result) {
                    if(result && result!="") {
                        var datas = eval("(" + result + ")");
                        _this.acceptDatas(datas);
                    }else{
                        //返回值为空时重新建立连接
                        setTimeout(function(){
                            _this.connection();
                        }, 10000);
                    }
                },
                error : function(param){
                    //服务器连接不上，重新建立连接
                    if(param.status==0){
                        _this.userParam[this.CONNECTIONID_KEY] = cid;
                        _this.connection();
                    }
                    //本地连接超时，继续轮询
                    //TODO Mark 此处无法判断状态值是否是504,503连接超时，待处理
                    if(param.status==504 || param.status==503){
                        _this.polling();
                    }
                }
            });
        },

        acceptDatas : function(datas) {
            // 接受的最后一个消息
            var lastData = datas[datas.length - 1];
            // 如果是断开连接
            var disconnect = this.isDisconnectObj(lastData);
            var len = datas.length;
            if (disconnect) {
                len--;
            }
            if (!disconnect) {// 如果不是断开连接，继续轮询
                if (this.async) {// 如果是异步处理
                    this.polling(this.cid);
                    this.acceptDatasByLength(datas, len);
                } else {
                    this.acceptDatasByLength(datas, len);
                    this.polling(this.cid);
                }
            } else {
                this.acceptDatasByLength(datas, len);
            }
        },

        isDisconnectObj : function(o) {
            return o[this.SYNCHRONIZE_KEY] == this.DISCONNECT_VALUE;
        },

        /**
         * 处理数组中指定长度的数据
         */
        acceptDatasByLength : function(datas, len, disconnect) {
            for ( var i = 0; i < len; i++) {
                var data = datas[i];
                this.accept(data,this.subscribes);
            }
        },

        /** 断开连接 */
        disconnect : function(userParam, callback, caller) {
            var param = userParam ? userParam : {};
            param[this.SYNCHRONIZE_KEY] = this.DISCONNECT_VALUE;
            param[this.CONNECTIONID_KEY] = this.cid;
            this.isConnect = false;
            var _this = this;
            window.top.topPage.ajax({
                type : 'GET',
                url : _this.url,
                data : param,
                crossDomain : true,
                success : function(result) {
                    caller = caller ? caller : null;
                    if (callback) {
                        callback.call(caller);
                    }
                }
            });
        }

    });

});
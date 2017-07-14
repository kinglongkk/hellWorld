var NearUserInfo = cc.Class.extend({
    ctor: function () {
        this.reset();
    },

    reset: function(){
        this.userCount = 0;
        this.userID = 0;
        this.gameID = 0;
        this.nickName = "";
        this.faceID = 0;
        this.customID = 0;
        this.gender = 0;
        this.memberOrder = 0;
        this.growLevel = 0;
        this.underWrite = "";
        this.longitude = 0;
        this.latitude = 0;
        this.distance = 0;
        this.clientAddr = 0;
    },

    // 用户数目
    setUserCount: function (nCount) {
        this.userCount = nCount;
    },

    getUserCount: function () {
        return this.userCount;
    },

    // 用户ID
    setUserID: function (nUserID) {
        this.userID = nUserID;
    },

    getUserID: function () {
        return this.userID;
    },

    // 游戏ID
    setGameID: function (gameID) {
        this.gameID = gameID;
    },

    getGameID: function () {
        return this.gameID;
    },

    // 用户昵称
    setNickName: function (nickName) {
        this.nickName = nickName;
    },

    getNickName: function () {
        return this.nickName;
    },

    // 头像ID
    setFaceID: function (faceID) {
        this.faceID = faceID;
    },
    
    getFaceID: function () {
        return this.faceID;
    },

    // 头像 I D
    setCustomID: function (nCustomID) {
        this.customID = nCustomID;
    },

    getCustomID: function () {
        return this.customID;
    },

    // 用户性别
    setGender: function (nSex) {
        this.gender = nSex;
    },
    
    getGender: function () {
        return this.gender;
    },
    
    // 会员等级
    setMemberOrder: function (nMember) {
        this.memberOrder = nMember;
    },
    
    getMemberOrder: function () {
        return this.memberOrder;
    },
    
    // 用户等级
    setGrowLevel: function (nLevel) {
        this.growLevel = nLevel;
    },
    
    getGrowLevel: function () {
        return this.growLevel;
    },
    
    // 个性签名
    setUnderWrite: function (underWrite) {
        this.underWrite = underWrite;
    },
    
    getUnderWrite: function () {
        return this.underWrite;
    },
    
    // 经度
    setLongitude: function (dLogitude) {
        this.longitude = dLogitude;
    },
    
    getLongitude: function () {
        return this.longitude;
    },
    
    // 纬度
    setLatitude: function (dLatitude) {
        this.latitude = dLatitude;
    },

    getLatitude: function () {
        return this.latitude;
    },

    // 目标距离
    setDistance: function (dDistance) {
        this.distance = dDistance;
    },

    getDistance: function () {
        return this.distance;
    },

    // 用户IP地址
    setClientAddr: function (nAddr) {
        this.clientAddr = nAddr;
    },

    getClientAddr: function () {
        return this.clientAddr;
    }
});
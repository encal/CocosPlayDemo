
var HelloWorldLayer = cc.Layer.extend({
    sigInfo : null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;
        var loginButton = new GameButton("登录");
        loginButton.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(loginButton);
        var self = this;
        cc.log("[encal] come in!!!");
        loginButton.setClickCallback(function(){
            // self.login();
        });
    },

    login: function () {
        cc.log("[encal] click login button");
        var liebaoToken = cc.sys.localStorage.getItem("liebaoToken");
        cc.log("[encal] liebaoToken");
        var token = liebaoToken ? liebaoToken : "sdka317d1d587a66929cbcffe12b9b173be";
        var param = {
            "token": token
        };

        pluginManager.login(param, this.loginCallback.bind(this));
    },

    loginCallback: function (plugin, code, msg) {
        //liebaoUtils.hideLoading();
        cc.log("[encal] on user result action.");
        cc.log("[encal] msg:" + msg);
        cc.log("[encal] code:" + code);

        if (code === UserActionResultCode.kInitSuccess) {
            cc.log("[encal] 登录初始化成功");
        } else if (code === UserActionResultCode.kInitFail) {
            cc.log("[encal] 登录初始化失败");
        } else if (code === UserActionResultCode.kLoginSuccess) {
            cc.log("[encal] 登录成功");
            cc.log("[encal] userInfo is "+ msg);
            var data = JSON.parse(msg);
            cc.sys.localStorage.setItem("[encal] liebaoToken",data.cp.token);
            cc.sys.localStorage.setItem("[encal] userInfo", msg);
            //this.showEnterGameButton();
        } else if (code === UserActionResultCode.kLoginFail) {
            cc.log("[encal] 登录失败");
        } else if (code === UserActionResultCode.kLoginCancel) {
            cc.log("[encal] 登录被取消");
        } else if (code === UserActionResultCode.kLogoutSuccess) {
            cc.log("[encal] 注销成功");
            this.showLoginButton();
        } else if (code === UserActionResultCode.kLogoutFail) {
            cc.log("[encal] 注销失败");
            //this.showLoginButton();
        } else if (code === UserActionResultCode.kSendToDesktopSuccess) {
            cc.log("[encal] 发送桌面快捷方式成功");
        } else if (code === UserActionResultCode.kSendToDesktopFail) {
            cc.log("[encal] 发送桌面快捷方式失败");
        } else {
            cc.log("[encal] 未知返回码:" + code);
        }
    }

    ///**
    // * 登录第一步,去自己服务器获取appid、appsig、appsigdata三个信息
    // */
    //getSigInfo: function () {
    //    var xhr = cc.loader.getXMLHttpRequest();
    //    var self = this;
    //    xhr.open("GET", "http://tencent.cocosruntime.com:5555/x5/get_login_info");
    //    xhr.onreadystatechange = function () {
    //        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
    //            var response = xhr.responseText;
    //            self.sigInfo = JSON.parse(response);
    //            cc.log("[encal] getLoginInfo success: response:" + response);
    //            self.checkToken(response);
    //        } else {
    //            cc.log("[encal] getLoginInfo failure: status:" + xhr.status);
    //        }
    //    };
    //    xhr.send();
    //},
    //
    ///**
    // * 登录第二步，获取token信息并判断token是否有效
    // */
    //checkToken: function (response) {
    //    // 获取token
    //    var token = pluginManager.x5_getToken();
    //    // 判断token是否有效
    //    if (pluginManager.x5_isTokenValid(token)) {
    //        // token有效，调用refreshToken的方法，不需要用户进行授权登录
    //        var appid = this.sigInfo["appid"];
    //        var appsig = this.sigInfo["appsig"];
    //        var param = {
    //            "appid": appid,
    //            "appsig": appsig,
    //            "qbopenid": token["qbopenid"],
    //            "refreshToken": token["refreshToken"]
    //        };
    //        this.refreshTencentToken(param);
    //    } else {
    //
    //    }
    //},
    //
    //refreshTencentToken: function (param) {
    //    pluginManager.x5_refreshToken(param, this.loginCallback.bind(this));
    //},
    //
    //loginCallback: function () {
    //    cc.log("[encal] on user result action.");
    //    cc.log("[encal] msg:" + msg);
    //    cc.log("[encal] code:" + code);
    //
    //    if (code === UserActionResultCode.kInitSuccess) {
    //        cc.log("[encal] 登录初始化成功");
    //    } else if (code === UserActionResultCode.kInitFail) {
    //        cc.log("[encal] 登录初始化失败");
    //    } else if (code === UserActionResultCode.kLoginSuccess) {
    //        cc.log("[encal] 登录成功");
    //        var msgObj = JSON.parse(msg);
    //        pluginManager.x5_setToken({
    //            "qbopenid": msgObj["qbopenid"],
    //            "refreshToken": msgObj["refreshToken"],
    //            "loginType": msgObj["loginType"]
    //        });
    //todo: 由于腾讯只有在登录的时候会返回用户信息，在refreshtoken的时候是不会返回用户信息的，所以登录完成的时候需要保存用户信息
    //        cc.sys.localStorage.setItem("userInfo", msg);
    //        this.showEnterGameButton();
    //    } else if (code === UserActionResultCode.kLoginFail) {
    //        cc.log("[encal] 登录失败");
    //    } else if (code === UserActionResultCode.kLoginCancel) {
    //        cc.log("[encal] 登录被取消");
    //    } else if (code === UserActionResultCode.kLogoutSuccess) {
    //        cc.log("[encal] 注销成功");
    //        pluginManager.x5_cleanToken();
    //        //this.showLoginButton();
    //    } else if (code === UserActionResultCode.kLogoutFail) {
    //        cc.log("[encal] 注销失败");
    //        pluginManager.x5_cleanToken();
    //        //this.showLoginButton();
    //    } else if (code === UserActionResultCode.kRefreshTokenSuccess) {
    //        cc.log("[encal] 刷新token成功");
    //        //this.showEnterGameButton();
    //    } else if (code === UserActionResultCode.kRefreshTokenFail) {
    //        cc.log("[encal] 刷新token失败");
    //        pluginManager.x5_cleanToken();
    //        //this.showLoginButton();
    //    } else if (code === UserActionResultCode.kSendToDesktopSuccess) {
    //        cc.log("[encal] 发送桌面快捷方式成功")
    //    } else if (code === UserActionResultCode.kSendToDesktopFail) {
    //        cc.log("[encal] 发送桌面快捷方式失败")
    //    } else {
    //        cc.log("[encal] 未知返回码:" + code)
    //    }
    //}
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});


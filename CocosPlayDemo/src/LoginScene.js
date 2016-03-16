/**
 * Created by encal on 15/11/25.
 */

var LoginScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new LoginLayer();
        this.addChild(layer);
    }
});

var LoginLayer = cc.Layer.extend({
    sigInfo : null,
    buttonLayer : null,

    ctor: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
        var winSize = cc.winSize;

        this.buttonLayer = new cc.Layer();
        this.addChild(this.buttonLayer);

        // title label
        var titleLabel = new cc.LabelTTF("LoginTest", "Arial", 38);
        titleLabel.setPosition(winSize.width/2, winSize.height/2 + 200);
        this.addChild(titleLabel, 5);

        var self = this;
        pluginManager.initAnySDK(function (isSucceed) {
            if (isSucceed) {
                if (pluginManager.isFunctionSupported("isTokenValid")) {
                    if (pluginManager.isTokenValid()) {
                        self.login();
                    } else {
                        CocosPlay.log("isTokenInvalid !!!")
                        self.showLoginMenu();
                    }
                } else {
                    self.showLoginMenu();
                }
            } else {
                Utils.showToast("AnySDK初始化失败");
            }
        });
    },

    loginCallback: function (code, msg) {
        CocosPlay.log("on user result action.");
        CocosPlay.log("code: " + code);
        CocosPlay.log("msg: " + msg);

        switch (code) {
            case anysdk.UserActionResultCode.kLoginSuccess:
                Utils.showToast("登录成功");
                if (g_env === CocosRuntimeEnv.TENCENT) {
                    var msgObj = JSON.parse(msg);
                    pluginManager.x5_setToken({
                        "qbopenid": msgObj["qbopenid"],
                        "refreshToken": msgObj["refreshToken"],
                        "loginType": msgObj["loginType"],
                        "nickName": msgObj["nickName"]
                    });
                    // todo: 由于腾讯只有在登录的时候会返回用户信息，在refreshtoken的时候是不会返回用户信息的，所以登录完成的时候需要保存用户信息
                    cc.sys.localStorage.setItem("userInfo", msg);
                }
                // 获取用户信息
                if (pluginManager.isFunctionSupported("getUserInfo")) {
                    pluginManager.getUserInfo(this.loginCallback.bind(this));
                } else {
                    var userId = pluginManager.getUserID();
                    CocosPlay.log("userID :" + userId);
                    // 获取用户信息成功，进入游戏
                    this.showGameEntry();
                }
                break;
            case anysdk.UserActionResultCode.kLoginFail:
                Utils.showToast("登录失败");
                break;
            case anysdk.UserActionResultCode.kLoginCancel:
                Utils.showToast("登录被取消");
                break;
            case anysdk.UserActionResultCode.kLoginNetworkError:
                Utils.showToast("登录网络错误");
                break;
            case anysdk.UserActionResultCode.kGetUserInfoSuccess:
                Utils.showToast("获取用户数据成功");
                var msgObj = JSON.parse(msg);
                CocosPlay.log("userInfo :" + msg);
                // 获取用户信息成功，进入游戏
                this.showGameEntry();
                break;
            case anysdk.UserActionResultCode.kGetUserInfoFail:
                Utils.showToast("获取用户数据失败");
                break;
            case anysdk.UserActionResultCode.kLogoutSuccess:
                Utils.showToast("注销成功");
                this.showLoginMenu();
                break;
            case anysdk.UserActionResultCode.kLogoutFail:
                Utils.showToast("注销失败");
                this.showLoginMenu();
                break;
            default :
                Utils.showToast("未知返回码: " + code);
        }
    },

    // 登录
    login: function (sender) {
        if (sender && sender.loginType != null) {
            pluginManager.setLoginType(sender.loginType);
        }
        pluginManager.login(this.loginCallback.bind(this));
    },

    showLoginMenu: function () {
        this.buttonLayer.removeAllChildren();
        var loginItemList = [];
        var winSize = cc.winSize;
        var self = this;
        var initLoginItemList = function() {
            var exitLabel = new cc.LabelTTF("退出", "Arial", 38);
            var exitItem = new cc.MenuItemLabel(exitLabel, self.exitGame, self);
            loginItemList.push(exitItem);

            CocosPlay.log(loginItemList);
            var menu = new cc.Menu(loginItemList);
            menu.attr({
                x : winSize.width/2,
                y : winSize.height/2,
            });
            menu.alignItemsVerticallyWithPadding(10);
            self.buttonLayer.addChild(menu);
        };
        switch (g_env) {
            case CocosRuntimeEnv.ANYSDK:
                if (pluginManager.isFunctionSupported("getAvailableLoginType")) {
                    pluginManager.getAvailableLoginType({}, function (code, msg) {
                        if (code === anysdk.UserActionResultCode.kGetAvailableLoginTypeSuccess) {
                            Utils.showToast("获取可登录类型成功");
                            var msgObj = JSON.parse(msg);
                            var result = msgObj["result"];
                            if (result === 0) {
                                var loginTypes = msgObj["loginTypes"];
                                for (var pos in loginTypes) {
                                    if (loginTypes[pos]["loginType"] == "qq") {
                                        var qqLoginLabel = new cc.LabelTTF("QQ登录", "Arial", 38);
                                        var qqLoginItem = new cc.MenuItemLabel(qqLoginLabel, self.login, self);
                                        qqLoginItem.loginType = "qq";
                                        loginItemList.push(qqLoginItem);
                                    } else if (loginTypes[pos]["loginType"] == "wx") {
                                        var wechatLoginLabel = new cc.LabelTTF("微信登录", "Arial", 38);
                                        var wechatLoginItem = new cc.MenuItemLabel(wechatLoginLabel, self.login, self);
                                        wechatLoginItem.loginType = "wx";
                                        loginItemList.push(wechatLoginItem);
                                    } else if (loginTypes[pos]["loginType"] == "guest") {
                                        var guestLoginLabel = new cc.LabelTTF("游客登录", "Arial", 38);
                                        var guestLoginItem = new cc.MenuItemLabel(guestLoginLabel, self.login, self);
                                        guestLoginItem.loginType = "guest";
                                        loginItemList.push(guestLoginItem);
                                    } else {
                                        CocosPlay.log("未知的登录类型：" + loginTypes[pos]["loginType"]);
                                    }
                                }
                            } else {
                                var anySDKLoginLabel = new cc.LabelTTF("登录", "Arial", 38);
                                var anySDKLoginItem = new cc.MenuItemLabel(anySDKLoginLabel, self.login, self);
                                loginItemList.push(anySDKLoginItem);
                            }
                            initLoginItemList();
                        } else if (code === anysdk.UserActionResultCode.kGetAvailableLoginTypeFail) {
                            Utils.showToast("获取可登录类型失败");
                        } else {
                            Utils.showToast("未知错误，错误码" + code);
                        }
                    });
                } else {
                    var anySDKLoginLabel = new cc.LabelTTF("登录", "Arial", 38);
                    var anySDKLoginItem = new cc.MenuItemLabel(anySDKLoginLabel, this.login, this);
                    loginItemList.push(anySDKLoginItem);
                    initLoginItemList();
                }
                break;
        }
    },

    // 退出游戏
    exitGame: function () {
        switch (g_env) {
            case CocosRuntimeEnv.LIEBAO:
            case CocosRuntimeEnv.BAIDU:
                CocosPlay.log("this channel not allow game exit");
                break;
            default :
                cc.director.end();
                break;
        }
    },

    // 登录成功后，显示进入游戏按钮
    showGameEntry: function () {
        this.buttonLayer.removeAllChildren();
        var functionList = [];
        var winSize = cc.winSize;
        var gameEntryLabel = new cc.LabelTTF("进入游戏", "Arial", 38);
        var gameEntryItem = new cc.MenuItemLabel(gameEntryLabel, function() {
            cc.director.runScene(new GameScene());
        }, this);
        functionList.push(gameEntryItem);

        if (pluginManager.isFunctionSupported("logout")) {
            var logoutLabel = new cc.LabelTTF("登出", "Arial", 38);
            var logoutItem = new cc.MenuItemLabel(logoutLabel, this.logout, this);
            functionList.push(logoutItem);
        }
        var gameEntryMenu = new cc.Menu(functionList);

        gameEntryMenu.attr({
            x : winSize.width/2,
            y : winSize.height/2,
        });
        gameEntryMenu.alignItemsVerticallyWithPadding(10);
        this.buttonLayer.addChild(gameEntryMenu);
    },

    // 登出
    logout: function () {
        pluginManager.logout(this.loginCallback.bind(this));
    }

});

var registerKeyEvent = function () {
    CocosPlay.log("registerKeyEvent");
    cc.eventManager.addListener(cc.EventListener.create({
        event: cc.EventListener.KEYBOARD,
        onKeyReleased: function (keyCode, event) {
            if (cc.sys.isNative) {
                cc.Dialog.show("确定退出游戏吗？", function (dialog) {
                    cc.director.end();
                }, function (dialog) {
                    cc.log("取消退出游戏");
                });
            }
        }
    }), -1);
};
registerKeyEvent();
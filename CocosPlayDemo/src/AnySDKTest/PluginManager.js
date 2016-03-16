/**
 * Created by encal on 15/12/10.
 */

// 注意：这里appKey, appSecret, privateKey, cocosplay-demo的参数, 游戏不可以使用此参数上线。
var appKey      = "78CF9F96-0D1B-4328-B81D-1FF2476A9B3D";
var appSecret   = "76e5378978fc439132ef61d4abbb5b97";
var privateKey  = "3B57E68AD0407E819EDF1B3779FD74C9";
var oauthLoginServer = "http://182.254.241.97:56999/coco_login";

var PluginManager = cc.Class.extend({
    anySDKAgent: null,
    userPlugin: null,
    iapPlugin: null,
    socialPlugin: null,
    sharePlugin: null,

    userCallback: null,
    iapCallback: null,
    socialCallback: null,
    shareCallback: null,
    _initCallback: null,
    _isInitialized: false,

    initAnySDK: function (initCallback) {
        if (this._isInitialized) {
            initCallback(true);
            return ;
        }
        this._initCallback = initCallback;
        CocosPlay.log("PluginManager initAnySDK");
        this.anySDKAgent = anysdk.agentManager;
        CocosPlay.log("appKey is " + appKey + ",appSecret is " + appSecret + ",privateKey is " + privateKey);
        anysdk.agentManager.init(appKey, appSecret, privateKey, oauthLoginServer);
        var self = this;
        this.userCallback = this.initUserPluginCallback;
        this.anySDKAgent.loadAllPlugins(function (code, msg) {
            CocosPlay.log("AnySDK init: loadAllPlugins code = " + code + ", msg = " + msg);
            if (code == 0) {
                // 获取用户插件，用户插件，用于登录，刷新 token 等用户相关的操作
                self.userPlugin = self.anySDKAgent.getUserPlugin();

                // 获取支付插件，支付插件，用于游戏内支付
                self.iapPlugin = self.anySDKAgent.getIAPPlugin();

                // 获取社交插件，社交插件，在腾讯模式下，主要用于获取好友列表
                self.socialPlugin = self.anySDKAgent.getSocialPlugin();

                // 获取分享插件，分享插件，主要用于唤起腾讯分享的界面进行分享操作
                self.sharePlugin = self.anySDKAgent.getSharePlugin();

                if (self.userPlugin) {
                    self.userPlugin.setListener(self.onUserResult, self);
                }

                if (self.iapPlugin) {
                    self.iapPlugin.setListener(self.onPayResult, self);
                }

                if (self.socialPlugin) {
                    self.socialPlugin.setListener(self.onSocialResult, self);
                }

                if (self.sharePlugin) {
                    self.sharePlugin.setListener(self.onShareResult, self);
                }
                this._isInitialized = true;
            }
        }, this);
    },

    initUserPluginCallback: function (code, msg) {
        CocosPlay.log("on user result action.");
        CocosPlay.log("code: " + code);
        CocosPlay.log("msg: " + msg);

        switch (code) {
            case anysdk.UserActionResultCode.kInitSuccess:
                CocosPlay.log("用户插件初始化成功");
                if (this._initCallback) {
                    this._initCallback(true);
                    this._initCallback = null;
                }
                break;
            case anysdk.UserActionResultCode.kInitFail:
                CocosPlay.log("用户插件初始化失败");
                if (this._initCallback) {
                    this._initCallback(false);
                    this._initCallback = null;
                }
                break;
            default :
                CocosPlay.log("initUserPluginCallback未知返回码: " + code);

        }
    },

    onUserResult: function (code, msg) {
        CocosPlay.log("onUserResult: code=" + code + ", msg=" + msg);
        if (this.userCallback) {
            this.userCallback(code, msg);
            //this.userCallback = null;
        }
    },

    onPayResult: function (code, msg) {
        CocosPlay.log("onPayResult: code=" + code + ", msg=" + msg);
        if (this.iapCallback) {
            this.iapCallback(code, msg);
            this.iapCallback = null;
        }
    },

    onShareResult: function (code, msg) {
        CocosPlay.log("onShareResult: code=" + code + ", msg=" + msg);
        if (this.shareCallback) {
            this.shareCallback(code, msg);
            this.shareCallback = null;
        }
    },

    onSocialResult: function (code, msg) {
        CocosPlay.log("onSociaResult: code=" + code + ", msg=" + msg);
        if (this.socialCallback) {
            this.socialCallback(code, msg);
            this.socialCallback = null;
        }
    },

    /**
     * 登录
     * */
    login: function (callback) {
        CocosPlay.log("login");
        if (callback) this.userCallback = callback;
        this.userPlugin.login();
    },

    /**
     * 注销账号
     * */
    logout: function (callback) {
        CocosPlay.log("logout");
        if (callback) this.userCallback = callback;
        if (this.userPlugin.logout) {
            this.userPlugin.logout();
        }
    },

    /**
     * 获取用户ID（同步）
     * */
    getUserID: function () {
        return this.userPlugin.getUserID();
    },

    /**
     * 获取用户信息（异步）
     * */
    getUserInfo: function (callback) {
        CocosPlay.log("getUserInfo");
        if (callback) this.userCallback = callback;
        if (this.userPlugin.getUserInfo){
            this.userPlugin.getUserInfo();
        } else {
            CocosPlay.log("Oops : getUserInfo isn't supported!");
        }
    },

    /**
     * 支付
     * */
    pay: function (param, callback) {
        CocosPlay.log("pay");
        if (callback) this.iapCallback = callback;
        if (cc.sys.isNative) {
            anysdk.ProtocolIAP.resetPayState();
        }
        cc.log("send info is "+JSON.stringify(param));
        this.iapPlugin.payForProduct(param);
    },

    /**
     * 发送到桌面快捷方式
     * */
    sendToDesktop: function(param, callback) {
        CocosPlay.log("sendToDesktop");
        if (callback) this.userCallback = callback;
        if (this.userPlugin.sendToDesktop) {
            this.userPlugin.sendToDesktop(param);
        } else {
            CocosPlay.log("Oops : sendToDesktop isn't supported!");
        }
    },

    /**
     * 打开话题圈/论坛
     * */
    openTopic: function (param, callback) {
        CocosPlay.log("openBBS");
        if (callback) this.userCallback = callback;
        if (this.userPlugin.openBBS) {
            this.userPlugin.openBBS(param);
        } else {
            CocosPlay.log("Oops : openBBS isn't supported!");
        }
    },

    /**
     * 获取可登录类型
     * */
    getAvailableLoginType: function (param, callback) {
        CocosPlay.log("getAvailableLoginType");
        if (callback) this.userCallback = callback;
        if (this.userPlugin.getAvailableLoginType) {
            this.userPlugin.getAvailableLoginType(param);
        } else {
            CocosPlay.log("Oops : getAvailableLoginType isn't supported!");
        }
    },

    /**
     * 设置登录类型
     * */
    setLoginType: function (param) {
        CocosPlay.log("setLoginType : " + param);
        if (this.userPlugin.setLoginType) {
            this.userPlugin.setLoginType(param);
        } else {
            CocosPlay.log("Oops : setLoginType isn't supported!");
        }
    },

    /**
     * 分享
     * */
    share: function (param, callback) {
        CocosPlay.log("share");
        if (callback) this.shareCallback = callback;
        if (this.sharePlugin.share) {
            this.sharePlugin.share(param);
        } else {
            CocosPlay.log("Oops : share isn't supported!");
        }
    },

    /**
     * 获取好友列表
     */
    getFriendsInfo: function (callback) {
        CocosPlay.log("getFriendsInfo");
        if (callback) this.socialCallback = callback;
        if (this.socialPlugin.getFriendsInfo) {
            this.socialPlugin.getFriendsInfo();
        } else {
            CocosPlay.log("Oops : getFriendsInfo isn't supported!");
        }
    },

    /**
     * 个别渠道特殊的接口，判断token是否有效
     * */
    isTokenValid: function () {
        CocosPlay.log("isTokenValid");
        if (this.userPlugin.isTokenValid) {
            return this.userPlugin.isTokenValid();
        } else {
            CocosPlay.log("Oops : isTokenValid isn't supported!");
            return false;
        }
    },

    /**
     * 判断渠道是否支持此功能
     * */
    isFunctionSupported: function (functionName) {
        if (this.userPlugin && (this.userPlugin[functionName] || this.userPlugin.isFunctionSupported(functionName))) return true;
        if (this.iapPlugin && (this.iapPlugin[functionName] || this.iapPlugin.isFunctionSupported(functionName))) return true;
        if (this.sharePlugin && (this.sharePlugin[functionName] || this.sharePlugin.isFunctionSupported(functionName))) return true;
        if (this.socialPlugin && (this.socialPlugin[functionName] || this.socialPlugin.isFunctionSupported(functionName))) return true;
        return false;
    }
});

// 目前 QQ浏览器 || QQ空间玩吧 || 猎豹浏览器 || 百度浏览器 暂时需要特殊处理，还不能使用此 DEMO 的代码
if (cc.runtime && cc.runtime.config && cc.runtime.config["channel_id"] != "100115"
    && cc.runtime.config["channel_id"] != "100117" && cc.runtime.config["channel_id"] != "100206"
    && cc.runtime.config["channel_id"] != "100125" ) {
    var _pluginManager = null;
    var pluginManager = function () {
        if (_pluginManager == null) {
            _pluginManager = new PluginManager();
        }
        return _pluginManager;
    }();
    CocosPlay.log("channel id is " + cc.runtime.config["channel_id"]);
}
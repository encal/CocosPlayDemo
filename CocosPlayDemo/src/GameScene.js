/**
 * Created by encal on 15/11/27.
 */

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

var GameLayer = cc.Layer.extend({
    userList : null,
    buttonLayer : null,
    picList: [
        "http://q4.qlogo.cn/g?b=qq&k=beJtiatHJSrdicPfohyBaB0w&s=640&t=1424414987",
        "http://pic1.ooopic.com/uploadfilepic/sheji/2009-08-09/OOOPIC_SHIJUNHONG_20090809ad6104071d324dda.jpg",
        "http://wenwen.sogou.com/p/20090901/20090901120429-209308118.jpg",
        "http://d.hiphotos.baidu.com/zhidao/pic/item/562c11dfa9ec8a13e028c4c0f603918fa0ecc0e4.jpg",
        "http://img2.ooopic.com/13/44/96/45bOOOPICa0_202.jpg",
        "http://img2.ooopic.com/13/43/00/21bOOOPICf7_202.jpg",
        "http://img2.ooopic.com/13/38/06/13bOOOPIC62_202.jpg",
        "http://img2.ooopic.com/13/43/32/50bOOOPICc6_202.jpg",
        "http://img2.ooopic.com/13/44/52/49bOOOPIC72_202.jpg",
        "http://img2.ooopic.com/13/44/52/46bOOOPICd3_202.jpg"
    ],

    ctor: function () {
        this._super();

        var winSize = cc.winSize;

        this.buttonLayer = new cc.Layer();
        this.addChild(this.buttonLayer);

        var label = new cc.LabelTTF("Game Scene", "Arial", 58);
        label.attr({
            x : winSize.width/2,
            y : winSize.height/2 + 200
        });
        this.addChild(label);

        this.initUserInfo();
        this.initFunctionList();
    },

    initUserInfo: function () {
        CocosPlay.log("init user info");
        var info = cc.sys.localStorage.getItem("userInfo");
        if (info) {
            var data = JSON.parse(info);
            CocosPlay.log("init user info, data = " + data);
        }
    },
    
    initFunctionList: function () {
        var winSize = cc.winSize;
        var functionList = [];

        var payLabel = new cc.LabelTTF("支付", "Arial", 30);
        var payItem = new cc.MenuItemLabel(payLabel, this.showPay, this);

        var shareLabel = new cc.LabelTTF("分享", "Arial", 30);
        var shareItem = new cc.MenuItemLabel(shareLabel, this.share, this);

        var sendToDeskLabel = new cc.LabelTTF("发送至桌面", "Arial", 30);
        var sendToDeskItem = new cc.MenuItemLabel(sendToDeskLabel, this.sendToDesktop, this);

        var friendsLabel = new cc.LabelTTF("好友列表", "Arial", 30);
        var friendsLabelItem = new cc.MenuItemLabel(friendsLabel, this.showFriendList, this);

        var forumLabel = new cc.LabelTTF("话题圈", "Arial", 30);
        var forumItem = new cc.MenuItemLabel(forumLabel, this.openTopic, this);

        var backLabel = new cc.LabelTTF("返回登录框", "Arial", 30);
        var backItem = new cc.MenuItemLabel(backLabel, this.back, this);

        if (pluginManager.isFunctionSupported("payForProduct")) {
            functionList.push(payItem);
        }
        if (pluginManager.isFunctionSupported("share")) {
            functionList.push(shareItem);
        }
        if (pluginManager.isFunctionSupported("sendToDesktop")) {
            functionList.push(sendToDeskItem);
        }
        if (pluginManager.isFunctionSupported("getFriendsInfo")) {
            functionList.push(friendsLabelItem);
        }
        if (pluginManager.isFunctionSupported("openBBS")) {
            functionList.push(forumItem);
        }
        functionList.push(backItem);

        var menu = new cc.Menu(functionList);
        menu.attr({
            x : winSize.width/2,
            y : winSize.height/2
        });
        menu.alignItemsVerticallyWithPadding(8);
        this.buttonLayer.addChild(menu);
    },

    /**
    * 显示支付窗口
    * */
    showPay: function () {
        CocosPlay.log("showPay");
        var userId = pluginManager.getUserID();
        if (userId) {
            var productId = new Date().getTime();
            var ext = this.getOrderId() + "_" + userId;
            var info = {
                Product_Price   : "1",
                Product_Id      : productId + "",
                Product_Name    : "新手大礼包",
                Server_Id       : "13",
                Product_Count   : "1",
                Role_Id         : userId + "",
                Role_Name       : "EnCaL",
                Role_Grade      : "10",
                Role_Balance    : "10",
                EXT             : ext
            };
            pluginManager.pay(info, this.payCallback.bind(this));
        } else {
            CocosPlay.log("user id is null please login first");
        }
    },

    /**
     * 获取OrderId
     * */
    getOrderId: function () {
        //todo please connect your game server to create an orderId
        return Date.now();
    },

    /**
     * 支付回调
     */
    payCallback: function (ret, msg, info) {
        CocosPlay.log("on pay result action.");
        CocosPlay.log("msg: " + msg);
        CocosPlay.log("info: " + info);

        switch (ret) {
            case anysdk.PayResultCode.kPaySuccess:
                Utils.showToast("支付成功");
                break;
            case anysdk.PayResultCode.kPayFail:
                Utils.showToast("支付失败");
                break;
            case anysdk.PayResultCode.kPayCancel:
                Utils.showToast("支付被取消");
                break;
        }
    },

    /**
     * 显示好友列表
     * */
    showFriendList: function () {
        CocosPlay.log("showFriendList");
        pluginManager.getFriendsInfo(function (code, msg) {
            switch (code) {
                case anysdk.SocialRetCode.kSocialGetFriendsInfoSuccess:
                    var obj = JSON.parse(msg);
                    var friendList = obj.friends;
                    if (friendList) {
                        /**
                        * todo:由于此demo没有写服务端代码，所以只能用模拟数据进行加载。
                        * 真实接入的时候，请在用户登录游戏的时候，保存qbopenid和iconURL到服务端，获取好友的时候，进行id匹配查询
                        */
                        var friendsInfo = [];
                        for (var i = 0; i < friendList.length; i++) {
                            var item = {
                                iconUrl : this.picList[i % 10],
                                nickName : "CocosPlayer" + i
                            };
                            friendsInfo.push(item);
                        }
                        var self = this;
                        var friendItemList = new ItemList(ItemListType.FRIENDS, friendsInfo, function () {
                            this.removeFromParent();
                            self.initFunctionList();
                        });
                        this.buttonLayer.removeAllChildren();
                        this.buttonLayer.addChild(friendItemList);
                    }
                    break;
                case anysdk.SocialRetCode.kSocialGetFriendsInfoFail:
                    Utils.showToast("获取好友信息失败");
                    break;
                default :
                    Utils.showToast("未知返回码 : " + code);
            }
        }.bind(this));
    },

    /**
     * 分享功能
     * */
    share: function () {
        CocosPlay.log("share");
        if (pluginManager.sharePlugin) {
            var info = {};
            info = {
                // 分享界面的标题
                title : "Cocos Play Demo",
                titleUrl : "http://game.html5.qq.com/h5Detail.html?gameId=2466856218",
                // 分享界面的描述
                description : "我是描述，一款很厉害的demo。",
                // 分享页面内的链接
                url : "http://game.html5.qq.com/h5Detail.html?gameId=2466856218",
                // 分享插图的标题
                imageTitle : "Cocos Play image title",
                // 分享插图的链接
                imageUrl : "http://res.imtt.qq.com/game_list/cocos.jpg",
                // 分享的内容
                text : "Cocos Play Share Text"
            };

            CocosPlay.log("share info:" + info);

            pluginManager.share(info, function (code, msg) {
                switch (code) {
                    case anysdk.ShareResultCode.kShareSuccess:
                        Utils.showToast("分享成功");
                        break;
                    case anysdk.ShareResultCode.kShareFail:
                        Utils.showToast("分享失败");
                        break;
                    case anysdk.ShareResultCode.kShareCancel:
                        Utils.showToast("分享取消");
                        break;
                    case anysdk.ShareResultCode.kShareNetworkError:
                        Utils.showToast("分享网络错误");
                        break;
                    default :
                        Utils.showToast("未知返回码 : " + code);
                }
            }.bind(this));
        } else {
            Utils.showToast("no share plugin");
        }
    },

    /**
     * 发送桌面快捷方式
     * */
    sendToDesktop: function () {
        var params = {
            "ext" : ""
        };
        pluginManager.sendToDesktop(params, function (code, msg) {
            if (code === anysdk.UserActionResultCode.kSendToDesktopSuccess) {
                Utils.showToast("发送桌面快捷方式成功");
            } else if (code === anysdk.UserActionResultCode.kSendToDesktopFail) {
                Utils.showToast("发送桌面快捷方式失败");
            } else {
                Utils.showToast("未知错误，错误码" + code);
            }
        }.bind(this));
    },

    /**
     * 打开话题圈/论坛
     * ps：打开话题圈功能需要腾讯在后台配置，此 demo 还未配置所以无效，但是代码是正确的，请放心使用 ^_^
     * */
    openTopic: function () {
        // 目前暂无渠道需要填写 url，用默认参数即可
        var params = {
            "url" : "http://play.cocos.com"
        };
        pluginManager.openTopic(params, function (code, msg) {
            if (code === anysdk.UserActionResultCode.kOpenBBSSuccess) {
                Utils.showToast("进入论坛成功");
            } else if (code === anysdk.UserActionResultCode.kOpenBBSFail) {
                Utils.showToast("进入论坛失败");
            } else {
                Utils.showToast("未知错误，错误码" + code);
            }
        }.bind(this));
    },

    /**
     * 返回登录页面
     * */
    back: function () {
        CocosPlay.log("GameScene back");
        cc.director.runScene(new LoginScene());
    }
});
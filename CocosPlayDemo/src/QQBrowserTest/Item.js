/**
 * Created by encal on 15/12/7.
 */

var QQBrowserPayItem = cc.TableViewCell.extend({
    info: null,
    ctor: function (info) {
        this._super();
        this.info = info;
    },

    onEnter: function () {
        this._super();
        this.setContentSize(cc.size(340, 80));
        this.init(this.info.iconUrl, this.info.payInfo);
    },

    init: function (iconUrl, payInfo) {
        var layer = new cc.LayerColor();
        layer.setColor(cc.color(77, 250, 250));
        layer.setContentSize(340, 80);

        var name = new cc.LabelTTF(payInfo + "Q米", "Arial", 20);
        name.setColor(cc.color(0, 0, 0));
        layer.addChild(name);
        layer.setPosition(cc.p(0, 0));
        layer.setAnchorPoint(cc.p(0, 0));
        this.addChild(layer);
        name.setPosition(cc.p(120, 40));

        var self = this;
        var button = new cc.MenuItemImage("res/buy.png", "res/buy_sel.png", function () {
            self.doPay();
        }, this);

        var menu = new cc.Menu(button);
        button.setPosition(cc.p(layer.width - button.width/2-20, 40));
        menu.setPosition(cc.p(0, 0));
        menu.setAnchorPoint(cc.p(0, 0));
        layer.addChild(menu);

        var icon = new cc.Sprite("res/default_photo.png");
        icon.setAnchorPoint(cc.p(0, 0));
        layer.addChild(icon);
        icon.setPosition(cc.p(10, 10));
        var self = this;
        cc.loader.loadImg(iconUrl, {width : 60, height : 60}, function (error, texture) {
            if (!error) {
                if (cc.sys.isObjectValid && cc.sys.isObjectValid(self)) {
                    icon.initWithTexture(texture);
                    icon.setAnchorPoint(cc.p(0, 0));
                } else {
                    cc.log("Oops, loadImg " + iconUrl + " associated node isn't valid!");
                }
            } else {
                cc.log("load image fail please check , url : " + iconUrl);
            }
        });
    },

    doPay: function () {
        var productId = this.getOrderId();
        var userId = pluginManager.getUserID();
        var ext = productId + "_" + userId;
        var info = {
            Product_Price   : (this.info.payInfo / 10) + "",
            Product_Id      : productId + "",
            Product_Name    : "gold",
            Server_Id       : "13",
            Product_Count   : "1",
            Rold_Id         : userId + "",
            EXT             : ext
        };
        pluginManager.pay(info, this.payCallback.bind(this));
    },

    getOrderId: function () {
        //todo please connect your game server to create an orderId
        return Date.now();
    },

    payCallback: function (code, msg) {
        CocosPlay.log("on pay result action.");
        CocosPlay.log("code: " + code);
        CocosPlay.log("msg: " + msg);

        switch (code) {
            case PayResultCode.kPaySuccess:
                Utils.showToast("支付成功");
                break;
            case PayResultCode.kPayFail:
                Utils.showToast("支付失败");
                var msgObj = JSON.parse(msg);
                var result = msgObj["result"];

                if (result == -3) {
                    //todo -3 表示需要重新登录
                } else if (result == -4) {
                    //todo -4 表示需要重新刷新 token
                }
                break;
            case PayResultCode.kPayCancel:
                Utils.showToast("支付被取消");
                break;
            case PayResultCode.kPayNeedLoginAgain:
                Utils.showToast("需要重新登录")
                //todo 重新登录逻辑
                break;
        }
    }
});

var QQBrowserFriendItem = cc.TableViewCell.extend({
    info: null,
    ctor: function (info) {
        this._super();
        this.info = info;
    },

    onEnter: function () {
        this._super();
        this.setContentSize(cc.size(340, 80));
        this.init(this.info.iconUrl, this.info.nickName);
    },

    init: function (iconUrl, nickName) {
        var layer = new cc.LayerColor();
        layer.setColor(cc.color(77, 255, 250));
        layer.setContentSize(340, 80);
        this.addChild(layer);

        var name = new cc.LabelTTF(nickName, "Arial", 20);
        name.setColor(cc.color(0, 0, 0));
        layer.addChild(name);
        layer.setPosition(cc.p(0, 0));
        layer.setAnchorPoint(cc.p(0, 0));
        name.setPosition(cc.p(150, 40));

        var icon = new cc.Sprite("res/default_photo.png");
        icon.setAnchorPoint(0, 0);
        layer.addChild(icon);
        icon.setPosition(cc.p(10, 10));
        var self = this;
        cc.loader.loadImg(iconUrl, {width : 60, height : 60}, function (error, texture) {
            if (!error) {
                if (cc.sys.isObjectValid && cc.sys.isObjectValid(self)) {
                    icon.initWithTexture(texture);
                    icon.setAnchorPoint(cc.p(0, 0));
                } else {
                    cc.log("Oops, loadImg " + iconUrl + " associated node isn't valid!");
                }
            } else {
                cc.log("load image fail please check , url : " + iconUrl);
            }
        });
    }
});
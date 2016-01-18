/**
 * Created by encal on 15/11/26.
 */

var CocosPlay = {};
CocosPlay.log = function (msg) {
    cc.log("===CocosPlayDemoLog===> " + msg);
};

var __Utils = cc.Class.extend({
    //showToast : function (msg) {
    //    //this.removeTip();
    //    //var winSize = cc.winSize
    //    //var scheduler = cc.director.getScheduler();
    //    //var tipLabel = cc.LabelTTF.create(msg, "Arial", 38);
    //    //tipLabel.attr({
    //    //    x : winSize.width/2,
    //    //    y : winSize.height/2
    //    //});
    //    //scheduler.scheduleCallbackForTarget(this, this.removeTip(), 2, 0, 0, false);
    //    //cc.director.getRunningScene().addChild(tipLabel, 99999, 10086);
    //    CocosPlay.log("showToast:" + msg);
    //},

    //removeTip: function () {
    //    var scheduler = cc.director.getScheduler();
    //    scheduler.unscheduleAllCallbacksForTarget(this);
    //    cc.director.getRunningScene().removeChildByTag(10086);
    //}

    toast: null,
    toastText: null,
    toastListener: null,

    ctor:function(){
        //this.init();
    },

    init:function(){
        this.toast = new cc.LayerColor();
        this.toast.setColor(cc.color(100,100,100));
        this.toast.setOpacity(255);
        this.toast._setWidth(cc.winSize.width / 2);
        this.toast._setHeight(cc.winSize.height / 2);
        this.toast.setAnchorPoint(cc.p(0.5,0.5));
        this.toast.setPosition(cc.p(cc.winSize.width / 4,cc.winSize.height / 4));
        this.addTipsToCurrentScene();
        //this.toast.retain();

        this.toastText = cc.LabelTTF.create("", "Arial", 30);
        this.toastText.setPosition(cc.p(this.toast.getContentSize().width / 2, this.toast.getContentSize().height / 2));
        this.toast.addChild(this.toastText);

    },

    showToast:function(msg){

        this.removeTipsFromCurrentScene();

        cc.log("Create new Tips. msg:" + msg);

        this.init();
        this.toastText.setString(msg);
        this.toggleToastTouch(true);

    },

    addTipsToCurrentScene:function(){
        cc.director.getRunningScene().addChild(this.toast,100000,10086);
        cc.log("===== add tips to current scene =====");
        //cc.log("this.toastText = " + this.toastText.getString());
    },

    removeTipsFromCurrentScene:function(){
        cc.log("===== remove tips from current scene =====");

        this.toggleToastTouch(false);
        cc.director.getRunningScene().removeChildByTag(10086);
    },

    toggleToastTouch:function(status){
        var self = this;
        if(status){
            if(this.toastListener == null){
                cc.log("addlistener");
                self.toastListener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function(touch,event){
                        self.toggleToastTouch(false);
                        self.removeTipsFromCurrentScene();

                        return true;
                    }
                });

                cc.eventManager.addListener(self.toastListener, self.toast);
            }
        }else{
            if(self.toastListener){
                cc.eventManager.removeListener(self.toastListener);
                self.toastListener = null;
            }
        }
    },

});

var Utils = null;
if (Utils == null) {
    Utils = new __Utils();
}
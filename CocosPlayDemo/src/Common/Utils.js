/**
 * Created by encal on 15/11/26.
 */

var CocosPlay = {};
CocosPlay.log = function (msg) {
    cc.log("===CocosPlayDemoLog===> " + msg);
};

var __Utils = cc.Class.extend({
    showToast : function (msg) {
        //this.removeTip();
        //var winSize = cc.winSize
        //var scheduler = cc.director.getScheduler();
        //var tipLabel = cc.LabelTTF.create(msg, "Arial", 38);
        //tipLabel.attr({
        //    x : winSize.width/2,
        //    y : winSize.height/2
        //});
        //scheduler.scheduleCallbackForTarget(this, this.removeTip(), 2, 0, 0, false);
        //cc.director.getRunningScene().addChild(tipLabel, 99999, 10086);
        CocosPlay.log("showToast:" + msg);
    },

    //removeTip: function () {
    //    var scheduler = cc.director.getScheduler();
    //    scheduler.unscheduleAllCallbacksForTarget(this);
    //    cc.director.getRunningScene().removeChildByTag(10086);
    //}
});

var Utils = null;
if (Utils == null) {
    Utils = new __Utils();
}
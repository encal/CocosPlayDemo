/**
 * Created by encal on 15/11/30.
 */

var ItemList = cc.Layer.extend({
    infoList : null,
    type : null,
    closeCallback : null,

    ctor: function (type, list, closeCallback) {
        this._super();
        this.type = type;
        this.infoList = list;
        this.closeCallback = closeCallback;
    },

    onEnter: function () {
        this._super();
        this.createTableView();
    },

    createTableView: function () {
        // background
        var bg = new cc.Scale9Sprite("res/listbg.png", cc.rect(0, 0, 96, 100), cc.rect(30, 30, 36, 40));
        bg.setContentSize(cc.size(400, 400));
        this.addChild(bg);
        bg.setPosition(cc.visibleRect.center);

        // close button
        var closeButton = new cc.MenuItemImage("res/close.png", "res/close_sel.png", this.closeCallback.bind(this), this);
        closeButton.setScale(0.8);
        var menu = new cc.Menu(closeButton);
        menu.setAnchorPoint(cc.p(0, 0));
        menu.setPosition(cc.p(0, 0));
        closeButton.setPosition(400, 400);
        bg.addChild(menu);

        // tableView
        var tableView = new cc.TableView(this, cc.size(340, 340));
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        tableView.setPosition(cc.p(30, 30));
        tableView.setAnchorPoint(cc.p(0, 0));
        tableView.setDelegate(this);
        bg.addChild(tableView);
        tableView.reloadData();
    },

    tableCellAtIndex: function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        if (!cell) {
            switch (this.type) {
                case ItemListType.FRIENDS:
                    cell = new QQBrowserFriendItem(this.getInfo(strValue));
                    break;
                case ItemListType.PAY:
                    cell = new QQBrowserPayItem(this.getInfo(strValue));
                    break;
            }
        }
        return cell;
    },

    getInfo: function (index) {
        return this.infoList[index];
    },

    numberOfCellsInTableView: function (table) {
        return this.infoList.length;
    },

    tableCellTouched: function (table, cell) {
        CocosPlay.log("cell touched at index: " + cell.getId());
    },

    tableCellSizeForIndex: function (table, idx) {
        return cc.size(340, 85);
    }
});
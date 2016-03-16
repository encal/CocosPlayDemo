/**
 * Created by encal on 15/11/25.
 */

var GAME_SERVER_ADDRESS = "http://tencent.cocosruntime.com:5555"
//GAME_SERVER_ADDRESS = "http://192.168.31.166:5555"

var CocosRuntimeEnv = {
    TENCENT : 100115,
    BAIDU   : 100117,
    LIEBAO  : 100125,
    WANBA   : 100206,
    ANYSDK  : 888888,
    H5ANYSDK: 999999
};

var g_env = cc.sys.isNative ? CocosRuntimeEnv.ANYSDK : CocosRuntimeEnv.H5ANYSDK;

var LoginActionType = {
    DIRECT  : 100,
    QQ      : 101,
    WECHAT  : 102,
    BAIDU   : 103,
    LIEBAO  : 104,
    WANBA   : 105,
    LOGOUT  : 106
};

var ItemListType = {
    PAY     : 100,
    FRIENDS : 101
};

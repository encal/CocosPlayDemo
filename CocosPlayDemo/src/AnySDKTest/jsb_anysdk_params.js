/**
 * Created by encal on 16/2/29.
 */

if (cc.runtime && cc.runtime.config) {
    /** 注意：
     * 1、纯 H5 上不要引入此文件，以免参数泄露。
     * 2、appKey, appSecret, privateKey, oauthLoginServer,为 cocosplay-demo 的参数, 游戏不可以使用此参数上线。
     */
    var anysdkParams = {
        appKey: "78CF9F96-0D1B-4328-B81D-1FF2476A9B3D",
        appSecret: "76e5378978fc439132ef61d4abbb5b97",
        privateKey: "3B57E68AD0407E819EDF1B3779FD74C9",
        oauthLoginServer: "http://182.254.241.97:56999/coco_login"
    };
}
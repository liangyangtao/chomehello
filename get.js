console.log("init...");
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse)
    {
        switch (request.name)
        {   
            case "clickMessage":
                console.log("begin click message");
                var _url = getWeiXinMessageUrl();
                console.log("message url: " + _url);
                sendResponse({url: _url});
            break;
            
            default:
            sendResponse({});
        }
    }
);

function getWeiXinMessageUrl() {
    return "https://wx.qq.com" + $(".message a").attr("href");
}

function closeCurrentTab() {
    chrome.extension.sendMessage({name: "close"});
}

chrome.extension.sendMessage({name: "getURL"}, function(response) {
    var _url = response.url;
    var _params = _url.split("?")[1];
    var key, uin;
    if (_params) {
        var _pairs = _params.split("&");
        var _param = new Array();
        for(i = 0; i < _pairs.length; i++) {
            var _temp = _pairs[i].split("=");
            _param[_temp[0]] = _temp[1];
        }
        key = _param["key"];
        uin = _param["uin"];
        console.log(_param);
        if(key && uin) {
            console.log(key + ";    " + uin);
            chrome.extension.sendMessage({name: "sendKey", key: key, uin: uin});
            closeCurrentTab();
        };
    }
});

/**
 * 注意：TalkingData的函数，原生代码在初始化页面时首先要调用到，所以，该js必须保证首先被加载。
 * 如果使用了 require-js，必须在加载require.js之前，同步加载TalkingData
 */

var isWebviewFlag;
function setWebViewFlag() {
    isWebviewFlag = true;
};

function loadURL(url) {
    var iFrame;
    iFrame = document.createElement("iframe");
    iFrame.setAttribute("src", url);
    iFrame.setAttribute("style", "display:none;");
    iFrame.setAttribute("height", "0px");
    iFrame.setAttribute("width", "0px");
    iFrame.setAttribute("frameborder", "0");
    document.body.appendChild(iFrame);
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
};

function exec(funName, args) {
    var commend = {
        functionName:funName,
        arguments:args
    };
    var jsonStr = JSON.stringify(commend);
    var url = "talkingdata:" + jsonStr;
    loadURL(url);
};

function runTrack(cmdFun)
{
    if(isWebviewFlag == true) {
        cmdFun && cmdFun();
    } else {
        $.ajax({
            type : "post",
            url : "/reqlocal?WebviewFlag=",
            async : true,
            contentType : "application/x-www-form-urlencoded;", // 避免乱码
            success : function(data) {
                var WebviewFlag = data.WEBVIEWFLAG;
                if(WebviewFlag == "true") {
                   cmdFun && cmdFun();
                }
            }
        });
    }
}

var TalkingData = {
    
    onEvent:function(eventId) {
        runTrack(function(){
            exec("trackEvent", [eventId]);
        });
    },
    onEventWithLabel:function(eventId, eventLabel) {
        runTrack(function(){
            exec("trackEventWithLabel", [eventId, eventLabel]);
        });
    },
    onEventWithParameters:function(eventId, eventLabel, eventData) {
        runTrack(function(){
            exec("trackEventWithParameters", [eventId, eventLabel, eventData]);
        });
    },
    onPageBegin:function(pageName) {
        runTrack(function(){
            exec("trackPageBegin", [pageName]);
        });
    },
    onPageEnd:function(pageName) {
        runTrack(function(){
            exec("trackPageEnd", [pageName]);
        });
    },
    setLocation:function(latitude, longitude) {
        runTrack(function(){
            exec("setLocation", [latitude, longitude]);
        });
    },
    onHTSCEvent:function(eventid, pageid, pagetitle, btnid, btntitle) {
        runTrack(function(){
            exec("onHTSCEvent", [eventid, pageid, pagetitle, btnid, btntitle]);
        });
    },
    onHTSCEventLegacy:function(eventid, eventsubid, pageid, pagetitle, btnid, btntitle, eventData) {
        runTrack(function(){
            exec("onHTSCEventLegacy", [eventid, eventsubid, pageid, pagetitle, btnid, btntitle, eventData]);
        });
    },
    onHTSCPageBegin:function(pageid, pagetitle) {
        runTrack(function(){
            exec("onHTSCPageBegin", [pageid, pagetitle]);
        });
    },
    onHTSCPageEnd:function(pageid) {
        runTrack(function(){
            exec("onHTSCPageEnd", [pageid]);
        });
    },

    onHTSCError:function(eventId, str0, str1) {
        runTrack(function(){
            exec("onHTSCError", [eventId, str0, str1]);
        });
    },
    onHTSCServiceError:function(eventId, khh, rzh, phoneNo, featureName, pageID, pageTitle, url, errorID, errorMsg, reserved, extraInfo) {
        runTrack(function(){
            exec("onHTSCServiceError", [eventId, khh, rzh, phoneNo, featureName, pageID, pageTitle, url, errorID, errorMsg, reserved, extraInfo]);
        });
    },
    // 2017-1-9增加通用的埋点方法
    onHTSCGeneralAppProcessing:function(eventid, str0, str1, str2, str3, str4, str5, str6, str7, str8, str9, int0, ini1) {
        runTrack(function(){
            exec("onHTSCGeneralAppProcessing", [eventid, str0, str1, str2, str3, str4, str5, str6, str7, str8, str9, int0, ini1]);
        });
    }
};

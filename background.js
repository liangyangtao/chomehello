var socket;

function clickMessage() {
	chrome.tabs.query({title: "微信网页版"}, function(tabs){
		if (tabs[0]) {
		    chrome.tabs.sendMessage(tabs[0].id, {name: "clickMessage"}, function(response){
		    	chrome.tabs.create({url: response.url + "&close=1", index: tabs[0].id + 1, active: false})
		    });					
		};
	});
}
chrome.browserAction.onClicked.addListener(function() {
	if (!socket || socket.readyState != 1) {
		socket = new WebSocket('ws://127.0.0.1:8080/dailyreport/zwSocketServer'); 
		socket.onopen = function(event) { 
		  chrome.browserAction.setIcon({path: "/images/icon48.png"});
		};
		socket.onmessage = function(event) {
		  console.log('Client received a message',event);
		  if (event.data == "getKey") {
			chrome.tabs.query({title: "微信网页版"}, function(tabs){
				if (tabs[0]) {
				    chrome.tabs.sendMessage(tabs[0].id, {name: "clickMessage"}, function(response){
				    	chrome.tabs.create({url: response.url, index: tabs[0].id + 1, active: false})
				    });					
				};
			});
		  };
		}; 
		socket.onclose = function(event) { 
		  console.log('Client notified socket has closed',event); 
		  chrome.browserAction.setIcon({path: "/images/icon48_b.png"});
		};
	} else {
		chrome.tabs.query({title: "微信网页版"}, function(tabs){
			if (tabs[0]) {
			    chrome.tabs.sendMessage(tabs[0].id, {name: "clickMessage"}, function(response){
			    	chrome.tabs.create({url: response.url, index: tabs[0].id + 1, active: false})
			    });					
			};
		});
	};
});

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse)
	{
		switch (request.name)
		{
			case "getURL":
				sendResponse({url: sender.tab.url});
			break;

			case "close":
				console.log("close tab" + sender.tab.id);
				chrome.tabs.remove([sender.tab.id]);
			break;

			case "sendKey":
				console.log("send key: " + request.key + "; " + request.uin);
				if (socket && socket.readyState == 1) {
					socket.send(request.key + ";" + request.uin);
				};
			break;
			
			default:
			sendResponse({});
		}
	}
);

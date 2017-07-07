// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        // With a new rule ...
        chrome.declarativeContent.onPageChanged.addRules([
            {
                // That fires when a page's URL contains a 'g' ...
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: 'vk.com/audio' }
                    })
                ],
                // And shows the extension's page action.
                actions: [ new chrome.declarativeContent.ShowPageAction() ]
            }
        ]);
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action === "xhttp") {
        var xhttp = new XMLHttpRequest();
        var method = request.method ? request.method.toUpperCase() : 'GET';

        xhttp.onload = function() {
            callback(xhttp.responseText);
        };
        xhttp.onerror = function() {
            callback();
        };
        console.log(typeof request.data);
        console.log(request.data);
        chrome.storage.sync.get('serverUrl', function (data) {
            var url = data.serverUrl;
            xhttp.open(method, url, true);
            xhttp.send(typeof request.data !== 'string' ? JSON.stringify(request.data) : request.data);
        });
        return true; // prevents the callback from being called too early on return
    }
});

chrome.pageAction.onClicked.addListener(function(tab) {
    console.log('chrome.pageAction.onClicked');
    chrome.tabs.create({'url': chrome.extension.getURL('settings.html'), 'selected': true});
});
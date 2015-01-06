var buttons = [];

chrome.webRequest.onHeadersReceived.addListener(function (details) {
  if(!(details.tabId in buttons)) {
    buttons[details.tabId] = {
      'active': false,
      'status': null,
      'hits':   'N/A'
    };
  }
  if (details.type === 'main_frame') {
    var headers = details.responseHeaders;
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i];
      header.name = header.name.toLowerCase();
      header.value = header.value.toLowerCase();

      if (header.name === 'via' && header.value.indexOf('varnish')) {
        // Only set the popup if page is cached via Varnish. Somehow the tabId will
        // only available after some delay.
        setTimeout(function(){
          chrome.browserAction.setPopup({
          tabId: details.tabId,
          popup: 'status.html'
        });
        }, 1000);
        buttons[details.tabId].active = true;
      }
      if (header.name === 'x-varnish-cache') {
        if (header.value.indexOf('hit') !== -1) {
            buttons[details.tabId].status = 'hit';
        } else if (header.value.indexOf('miss') !== -1) {
            buttons[details.tabId].status = 'miss';
        }
      }
      if(header.name === 'x-varnish-hits') {
        buttons[details.tabId].hits =  header.value;
      }
    }
  }
}, {
  urls: [
    "http://*/*",
    "https://*/*"
  ]
}, [ 'responseHeaders' ]);

chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.frameId === 0) {
    var color = (buttons[details.tabId].active) ? 'blue' : 'gray';
    if(buttons[details.tabId].status !== null) {
      switch (buttons[details.tabId].status) {
        case 'hit':
          color = 'green';
          chrome.browserAction.setBadgeBackgroundColor({
            color: [0, 160, 0, 200],
            tabId: details.tabId
          });
          chrome.browserAction.setBadgeText({
            text: buttons[details.tabId].hits,
            tabId: details.tabId
          });
          break;
        case 'miss':
          color = 'red';
          chrome.browserAction.setBadgeBackgroundColor({
            color: [255, 0, 0, 255],
            tabId: details.tabId
          });
          chrome.browserAction.setBadgeText({
            text: 'MISS',
            tabId: details.tabId
          });
          break;
      }
    }
    else {
        chrome.browserAction.setBadgeText({
        text: '',
        tabId: details.tabId
        });
        chrome.browserAction.setBadgeBackgroundColor({
        color: [0, 0, 0, 0],
        tabId: details.tabId
        });
    }
    chrome.browserAction.setIcon({
      path: 'img/button_' + color + '.png',
      tabId: details.tabId
    });
  }
});

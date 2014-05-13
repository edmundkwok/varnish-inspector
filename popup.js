chrome.tabs.getSelected(function(tab) {
    var url = tab.url;

    // Inspired from https://gist.github.com/mshmsh5000/7450623.
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('PURGE', url, true);
    xmlHttp.setRequestHeader("X-Purge-Key", "MYSUPERSECRETKEY");

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4) {
        if (xmlHttp.status === 200) {
          document.write("Varnish cache cleared!");
          document.write('<style>body { min-width: 150px } </style>');
        }
        else if (xmlHttp.status === 404) {
          document.write("Page is not in cache");
          document.write('<style>body { min-width: 130px } </style>');
        }
        else {
          document.write('Error clearing cache - permissions issue?');
          document.write('<style>body { min-width: 260px } </style>');
        }
      }
    };
    xmlHttp.send(null);
  }
);


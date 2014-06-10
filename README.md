# Varnish Inspector

A simple Google Chrome extension that shows if a page being served up via a Varnish web accelerator is fresh or not.

## Screenshots

Currently this addon consists of a single toolbar button that changes state based on detected HTTP headers.

### Default

The button icon appears gray/disabled when no special HTTP headers are detected.

![Button when inactive](https://raw.github.com/deizel/varnish-inspector/master/img/screenshot_inactive.png)

### Varnish detected

The button icon becomes Varnish-blue when the HTTP header `Via` is detected containing the string "varnish":

![Button when active](https://raw.github.com/deizel/varnish-inspector/master/img/screenshot_active.png)

### Cache miss

The button becomes red-ish in color when the HTTP header `X-Cache` is detected containing the string "MISS":

![Button when cache miss](https://raw.github.com/deizel/varnish-inspector/master/img/screenshot_miss.png)

### Cache hit

The button becomes green in color when the HTTP header `X-Cache` is detected containing the string "HIT":

![Button when cache hit](https://raw.github.com/deizel/varnish-inspector/master/img/screenshot_hit.png)

The label text is updated to reflect the number of cache hits if the HTTP header `X-Cache-Hits` is present.

## Clearing page cache

The current page cache can be cleared (i.e. purged / banned) by clicking on the extension icon.

You either will see this:

![Cache cleared](https://raw.github.com/edmundkwok/varnish-inspector/master/img/screenshot_cache_cleared.png)

Or this:

![Page not in cache](https://raw.github.com/edmundkwok/varnish-inspector/master/img/screenshot_cache_404.png)

### Configuration

To enable clearing of Varnish cache from the extension, we set an extra header, X-Purge-Key, with a secret key that is passed from the extension to Varnish. From Varnish, we check if the secret key exists and allow the purge. The secret key can be anything you want it to be.

This is is set in the following files:

1. [popup.js](https://github.com/edmundkwok/varnish-inspector/blob/master/popup.js) in the extension
2. Varnish VCL configuration

### popup.js

```javascript
7 xmlHttp.setRequestHeader("X-Purge-Key", "MYSUPERSECRETKEY");
```

Replace MYSUPERSECRETKEY with your secrety key.

Example:

```javascript
7 xmlHttp.setRequestHeader("X-Purge-Key", "$upercalifragilistic3xpialidocious");
```

### Varnish VCL

If you're following the official Varnish [Purge and banning](https://www.varnish-cache.org/docs/3.0/tutorial/purging.html) configuration, add another expression to check if your secrety key is passed along with the request. You can combine this with any other expressions.

```bash
if (req.request == "PURGE") {
  if (!client.ip ~ purgers && req.http.X-Purge-Key != "MYSUPERSECRETKEY") {
    error 405 "Method not allowed";
  }
  return (lookup);
}
```

Replace MYSUPERSECRETKEY with your secrety key.

Example:

```bash
if (req.request == "PURGE") {
  if (!client.ip ~ purgers && req.http.X-Purge-Key != "$upercalifragilistic3xpialidocious") {
    error 405 "Method not allowed";
  }
  return (lookup);
}
```

If you see this:

![Error clearing cache](https://raw.github.com/edmundkwok/varnish-inspector/master/img/screenshot_cache_error.png)

Make sure your secret key is the same in both popup.js and your Varnish VCL.

## TODOS

1. Add configuration dialog to set secret key from extension

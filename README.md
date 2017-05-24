# cross-tab-channel

This is a simple library for sending data between browser tabs. It uses storage events for same domain use, and adds in postMessage with an iframe for cross domain messaging. There is also a [redux middleware](https://github.com/stutrek/cross-tab-middleware).

## Why this one?

There are a few of these, but none were what I wanted.

* Cross Domain
* Simplicity - the first release was 1.2k and under 50 lines of code. You get a channel that is an emitter. Nothing else.
* no OnBeforeUnload events - these events mess with the browser cache in undesireable ways that can make hitting the back button painful.

## Usage


### Same Domain
To use this library you listen to changes to a channel. A channel is identified with a string.

```javascript
import CrossTab from 'cross-tab-channel';

var channel = new CrossTab('my-channel-name');

channel.listen(function (message) {
    console.log(message);
});

channel.emit({
    my: 'data'
});

channel.remove(anyPreviouslyAppliedListener);
```

You may emit messages of any type, as long as they can be JSON encoded.

### Cross Domain

This is more tricky because the browser won't send storage events across domains. It needs to load an iframe hosted on your domain so the library can postMessages to and from it. Luckilly, [that iframe](./dist/iframe.html) has already been made and can be hosted statically after changing the `trustedDomain` variable to the domain you wish to share data with.

```javascript
import CrossDomain from 'cross-tab-channel/dist/CrossDomain';

// create the iframe that will serve as middleman between your domain and this one
// you can find iframe.html in the dist folder of this repo.
CrossDomain.createIframe('//your-domain.com/path/to/iframe.html');

// channel names are shared with normal, same domain, messaging.
var channel = new CrossDomain('my-channel-name');

channel.listen(function (message) {
    console.log(message);
});

channel.emit({
    my: 'data'
});

channel.remove(anyPreviouslyAppliedListener);
```

#### Cross Domain Security

If you are not in control of all domains this will be used on, anyone running JavaScript on the receiving site, including advertisers and trackers, can intercept messages. As the library is now, third parties could potentially send fake events.

* **Do not send privacy critical data**, such as passwords, credit card numbers, or authorization tokens across domains.
* **Do not make the `trustedDomain` infinitely configurable** with a query or path paramter when serving the iframe HTML unless you want to open up your messages to potentially evil third parties.

## Testing

`yarn start` will start the dev server. Visit http://localhost/test.html and http://127.0.0.1/crossDomain.html and open the console to see it in action.

## Browser Compatibility

Briefly tested on IE9 with surprisingly successful results.

# cross-tab-channel

This is a simple library for sending data between same-domain browser tabs. It uses storage events. There is also a [redux middleware](https://github.com/stutrek/cross-tab-middleware).

## Why this one?

There are a few of these, but none were what I wanted.

* Simplicity - the first release was 1.2k and under 50 lines of code. You get a channel that is an emitter. Nothing else.
* no OnBeforeUnload events - these events mess with the browser cache in undesireable ways that can make hitting the back button painful.

## Usage

To use this library you listen to changes to a channel. A channel is identified with a string.

```javascript

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

## Testing

Run a local server and open test.html in two browser tabs. You can copy and paste the provided messages or make your own.

## Browser Compatibility

IE 9 and better, you can go back to IE 8 if you use an addEventListener polyfill.

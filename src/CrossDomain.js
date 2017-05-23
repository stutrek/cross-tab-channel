var iframe = null;
var iframeLoaded = false;
var queue = [];

var channels = {};

window.addEventListener('message', function(e) {
	var payload = e.data;

	if (payload.isCrossTab) {
		let channelName = payload.channel;
		let data = payload.message;
		channels[channelName].listeners.forEach(listener => listener(data));
	}
	if (payload.isCrossTabStartup) {
		iframeLoaded = true;
		queue.forEach(entry => {
			if (entry.method === 'addChannel') {
				iframe.contentWindow.postMessage({
					isCrossTabAdd: true,
					channel: entry.args[0]
				}, '*');
			} else {
				channels[entry.channel][entry.method].apply(channels[entry.channel], entry.args);
			}
		});
		queue = null;
	}
});

class Channel {
	constructor (stringIdentifier) {

		if (!iframe) {
			throw new Error('To use cross-tab-channel across domains you must first CrossTab.createIframe("http://path/to/cross-tab-channel/iframe.html")');
		}

		if (channels[stringIdentifier]) {
			return channels[stringIdentifier];
		}

		channels[stringIdentifier] = this;

		this.id = stringIdentifier;
		this.listeners = [];

		if (typeof window !== 'undefined') {
			if (iframeLoaded) {
				iframe.contentWindow.postMessage({
					isCrossTabAdd: true,
					channel: stringIdentifier
				}, '*');
			} else {
				queue.push({
					method: 'addChannel',
					args: [stringIdentifier]
				});
			}
		}
	}

	listen = (listener) => {
		if (this.listeners.indexOf(listener) === -1) {
			this.listeners.push(listener);
		}
	}

	remove = (listener) => {
		this.listeners = this.listeners.filter(l => l !== listener);
	}

	emit = (data) => {
		if (iframeLoaded) {
			iframe.contentWindow.postMessage({
				isCrossTab: true,
				channel: this.id,
				message: data
			}, '*');
		} else {
			queue.push({
				channel: this.id,
				method: 'emit',
				args: [data]
			});
		}
	}
}

Channel.createIframe = function (url) {
	iframe = document.createElement('iframe');
	iframe.src = url;
	iframe.style.position = 'absolute';
	iframe.style.pointerEvents = 'none';
	iframe.style.zIndex = '-1';

	document.body.appendChild(iframe);

};

module.exports = Channel;

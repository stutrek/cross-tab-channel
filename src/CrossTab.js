let windowId = Math.random();

class Channel {
	constructor (stringIdentifier) {
		this.id = stringIdentifier;
		this.listeners = [];

		if (typeof window !== 'undefined') {
			window.addEventListener('storage', (event) => {
				if (!event.newValue) {
					return;
				}
				if (event.key === 'cross-tab-' + this.id) {
					let payload = JSON.parse(event.newValue);
					if (payload.origin !== windowId) {
						this.listeners.forEach(listener => {
							listener(payload.data);
						});
					}
				}
			});
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
		var payload = {
			origin: windowId,
			data
		};
		localStorage.setItem('cross-tab-' + this.id, JSON.stringify(payload));
		setTimeout(() => {
			localStorage.removeItem('cross-tab-' + this.id);
		}, 0);
	}
}

module.exports = Channel;

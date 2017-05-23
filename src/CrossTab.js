class Channel {
	constructor (stringIdentifier) {
		this.id = stringIdentifier;
		this.listeners = [];

		if (typeof window !== 'undefined') {
			window.addEventListener('storage', (event) => {
				if (event.newValue === null) {
					return;
				}
				if (event.key === 'cross-tab-' + this.id) {
					let eventData = JSON.parse(event.newValue);
					this.listeners.forEach(listener => {
						listener(eventData);
					});
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
		localStorage.setItem('cross-tab-' + this.id, JSON.stringify(data));
		setTimeout(() => {
			localStorage.removeItem('cross-tab-' + this.id);
		}, 0);
	}
}

module.exports = Channel;

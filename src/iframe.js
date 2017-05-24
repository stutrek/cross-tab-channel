import CrossTab from './CrossTab';

let channels = {};
let pipes = {};

var trustedDomain = window.trustedDomain;
if (trustedDomain.indexOf('//') === 0) {
	trustedDomain = window.location.protocol + trustedDomain;
}

function postMessage (payload) {
	window.parent.postMessage(JSON.stringify(payload), trustedDomain);
}

function pipe (channelName, message) {
	let payload = {
		isCrossTab: true,
		channel: channelName,
		message: message
	};
	postMessage(payload);
}


function createPipe (channelName) {
	return function (message) {
		pipe(channelName, message);
	};
}

window.addEventListener('message', function(e) {
	if (e.origin !== trustedDomain) {
		return;
	}
	try {
		var payload = JSON.parse(e.data);
	} catch (e) {
		return;
	}
	let channelName = payload.channel;

	if (payload.isCrossTab) {
		let data = payload.message;
		channels[channelName].emit(data);
	}

	if (payload.isCrossTabAdd) {
		if (!channels[channelName]) {
			channels[channelName] = new CrossTab(channelName);

			let receive = createPipe(channelName);
			pipes[channelName] = receive;
			channels[channelName].listen(receive);
		}
	}

	if (payload.isCrossTabRemove) {
		channels[channelName].remove(pipes[channelName]);
		delete channels[channelName];
	}
});


postMessage({
	isCrossTabStartup: true
});


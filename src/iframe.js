import CrossTab from './CrossTab';

let channels = {};
let pipes = {};

function pipe (channelName, message) {
	let payload = {
		isCrossTab: true,
		channel: channelName,
		message: message
	};
	window.parent.postMessage(payload, '*');
}


function createPipe (channelName) {
	return function (message) {
		pipe(channelName, message);
	};
}

window.addEventListener('message', function(e) {
	var payload = e.data;
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


window.parent.postMessage({
	isCrossTabStartup: true
}, '*');


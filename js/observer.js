const DOMObserver = {
	parsers: [],
	watchers: [],
	queue: [],
	observer: new MutationObserver( records => {
		for( const record of records ) {
			DOMObserver.force(record);
		}
	}).observe(document.body, {
		subtree: true,
		childList: true
	}),
	addParser (parser, selector) {
		if( selector ) DOMObserver.queue.push(selector);
		DOMObserver.parsers.push(parser);
	},
	addWatcher (watcher) {
		DOMObserver.watchers.push(watcher);
	},
	drain() {
		for( const selector of DOMObserver.queue ) {
			DOMObserver.force({addedNodes: document.querySelectorAll(selector)});
		}
		DOMObserver.queue = [];
	},
	force({addedNodes, removedNodes = []}) {
		for( const addedNode of Array.from(addedNodes) ) {
			if( !addedNode.classList ) return;
			DOMObserver.parsers.forEach( parser => parser(addedNode));
		}
		for( const removedNode of Array.from(removedNodes) ) {
			DOMObserver.watchers.forEach(watcher => watcher(removedNode));
		}
	}
};

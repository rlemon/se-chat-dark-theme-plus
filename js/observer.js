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

    // this means that it's entering edit mode
    if(addedNodes.length === 1 && addedNodes[0].alt === 'please wait') {

      // here we just check if the message could be code
      // and if the code module is around in our format
      if( showCodeMode && input.value.split('\n')
          .filter((line) => !line.startsWith(' '.repeat(4)))
          .length === 0 ) {

        // and here we format the message so it won't add more tabs in code mode
        input.value = input.value.split('\n')
          .map((line) => line.substring(4, line.length))
          .join('\n');
        showCodeMode();
      }
    }

		for( const addedNode of Array.from(addedNodes) ) {
			if( !addedNode.classList ) return;
			DOMObserver.parsers.forEach( parser => parser(addedNode));
		}
		for( const removedNode of Array.from(removedNodes) ) {
			DOMObserver.watchers.forEach(watcher => watcher(removedNode));
		}
	}
};

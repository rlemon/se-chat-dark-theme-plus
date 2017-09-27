window.hljs.initHighlightingOnLoad();
const highlightParser = node => {
    if (node.classList.contains('message')) {
    	let pres = node.querySelectorAll('pre');
    	[...pres].forEach(pre => {
    		window.hljs.highlightBlock(pre);
        if(pre.classList.contains('partial')) {
          let moreDataButton = node.querySelector('a.more-data');
          DOMObserver.addWatcher((removed) => {
            if(removed === moreDataButton) {
              window.hljs.highlightBlock(pre);
            }
          })
        }
    	});
    }
};
DOMObserver.addParser(highlightParser, '.user-container .message');

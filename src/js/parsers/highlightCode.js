window.hljs.initHighlightingOnLoad();
const highlightParser = node => {
    if (node.classList.contains('message')) {
    	let pre = node.querySelector('pre');
    	let moreLink = node.querySelector('.more-data');
      if(pre) {
        window.hljs.highlightBlock(pre);
      }
      
    	if(moreLink) {
    		moreLink = removeAllListeners(moreLink);
    		moreLink.addEventListener('click', (e) => highlightFullText(e, pre));
    	}
    }
};

const removeAllListeners = (el) => {
	let clone = el.cloneNode(true);
	el.parentNode.replaceChild(clone, el);
	return clone;
}

const highlightFullText = (e, pre) => {
	e.preventDefault();
	let anchor = e.target;
	fetch(e.target.href).then((e) => e.text().then(text => {
		pre.innerHTML = text;
		hljs.highlightBlock(pre);
		anchor.parentNode.removeChild(anchor);
	}));
}

watcher.addParser(highlightParser, '.user-container message');
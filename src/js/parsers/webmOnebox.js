const webmOneboxParser = node => {
	if( node.classList.contains('message') && !node.classList.contains('pending') ) {
		let content = node.querySelector('.content');
		if( content.childNodes.length > 1 ) return; // https://github.com/rlemon/se-chat-dark-theme/issues/30
		let anchor = content.querySelector('a');
		if( !anchor || !/(webm|gifv)$/.test(anchor.href) ) return; // failed to get anchor, or anchor isn't a webm/gifv
		if( anchor.rel === 'nofollow' ) return; // user changed the anchor text. [hello world](webm/gifv link) adds a nofollow to the link. this is the only way I could determine this.
		let vid = document.createElement('video');
		vid.controls = true;
		vid.src = anchor.href.replace(/(gifv)$/,'webm');
		vid.width = 320;
		vid.height = 240;
		content.replaceChild(vid, anchor);
	}
};

watcher.addParser(webmOneboxParser, '.user-container .message');
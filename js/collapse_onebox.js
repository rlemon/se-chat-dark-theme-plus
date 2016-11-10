const FALSE = 'false';
const TRUE = 'true';
const lblOpen = '▼ show ';
const lblClose = '▲ hide ';
function prettyLink(url, limit = 54) {
    const noprot = url.split('//')[1];
    const parts = noprot.split('/');
    if (noprot.length < limit) {
        return noprot;
    }
    let tpre = parts[0];
    let tpost = parts[parts.length - 1];
    const hl = (limit - 2) / 2;
    if (tpre.length > hl) {
        tpre = tpre.slice(0, hl);
    }
    if (tpost.length > hl) {
        tpost = tpost.slice(-hl);
    }
    return `${tpre}...${tpost}`;
}
function collapseOnebox(node) {
    const autoCollapse = options.collapse_onebox_default;
    const pauseYoutubeOnCollapse = options.pause_youtube_on_collapse;
    if( !node.classList || !node.classList.contains('message') || node.classList.contains('pending') ) return;
    const ob = node.querySelector('.onebox');
    const tb = node.querySelector('.toggle-bar-dark-theme');
    if( !ob || tb ) return; // exit if not found
    const container = ob.parentNode;
    const toggleBar = document.createElement('div');
    toggleBar.classList.add('toggle-bar-dark-theme');
    toggleBar.dataset.isOpen = autoCollapse ? TRUE : FALSE;
    const link = ob.querySelector('a,iframe');
    let anchor = '';
    if( link ) {
        anchor += ` <a href="${link.href}" target="_blank" title="${link.href}">${prettyLink(link.href)}</a>`
    }
    toggleBar.innerHTML = ( autoCollapse ? lblOpen : lblClose ) + anchor;
    toggleBar.onclick = function(event) {
        if( event.target !== this ) return;
        const {isOpen} = this.dataset;
        this.dataset.isOpen = isOpen === TRUE ? FALSE : TRUE;
        this.innerHTML = (isOpen === TRUE ? lblClose : lblOpen) + anchor;
        this.nextElementSibling.hidden = isOpen === FALSE;
        const youtube = container.querySelector('iframe.youtube-onebox');
        if(youtube && pauseYoutubeOnCollapse) {
            const {contentWindow} = youtube;
            const func = isOpen === FALSE ? 'pauseVideo' : 'playVideo';
            contentWindow.postMessage(`{"event":"command","func":"${func}","args":""}`, '*');
        }
    };
    ob.hidden = autoCollapse;
    container.insertBefore(toggleBar, ob);
}
DOMObserver.addParser(collapseOnebox, '.user-container .message');
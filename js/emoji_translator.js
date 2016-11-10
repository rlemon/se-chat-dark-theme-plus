;(function() {
    "use strict";
    const input = document.getElementById('input');
    input.addEventListener('keyup', event => {
        const isAnAllowedKey = [ 32, 186 ].includes(event.which);
        if( !isAnAllowedKey ) return;
        input.value = input.value.split(' ').map(word => {
        	const found = emojiData.find(item => item.triggers.includes(word));
        	if( found ) {
        		return found.emoji;
        	}
        	return word;
        }).join(' ');
    });
}());
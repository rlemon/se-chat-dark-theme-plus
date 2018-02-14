//@ts-check
'use strict';

// Setup CodeMirror

/** @type {HTMLInputElement} */
const input = document.getElementById('input');

const codeMirror = CodeMirror(el => { el.hidden = true; input.parentNode.insertBefore(el, input); }, {
	value: input.value,
	theme: 'monokai',
	mode: 'javascript'
});

const modeSelect = document.createElement('select');
const storageKey = 'se-dark-theme-chat-codemirror-mode-' + Number(/\d+/.exec(location.href)[0]);
const currentMode = window.localStorage.getItem(storageKey) || 'javascript';

modeSelect.innerHTML = '<option value="cmake">cmake</option><option value="cobol">cobol</option><option value="coffeescript">coffeescript</option><option value="commonlisp">commonlisp</option><option value="css">css</option><option value="dart">dart</option><option value="go">go</option><option value="groovy">groovy</option><option value="haml">haml</option><option value="haskell">haskell</option><option value="htmlembedded">htmlembedded</option><option value="htmlmixed">htmlmixed</option><option value="jade">jade</option><option value="javascript">javascript</option><option value="lua">lua</option><option value="markdown">markdown</option><option value="mathematica">mathematica</option><option value="nginx">nginx</option><option value="pascal">pascal</option><option value="perl">perl</option><option value="php">php</option><option value="puppet">puppet</option><option value="python">python</option><option value="ruby">ruby</option><option value="sass">sass</option><option value="scheme">scheme</option><option value="shell">shell</option><option value="sql">sql</option><option value="swift">swift</option><option value="twig">twig</option><option value="vb">vb</option><option value="vbscript">vbscript</option><option value="vhdl">vhdl</option><option value="vue">vue</option><option value="xml">xml</option><option value="xquery">xquery</option><option value="yaml">yaml</option>';

for (const option of modeSelect.options) {
	option.selected = option.value === currentMode;
}

modeSelect.addEventListener('change', changeMode);
modeSelect.hidden = true;
document.getElementById('chat-buttons').appendChild(modeSelect);
window.addEventListener('keydown', parseKeydown, true);

const btnSubmit = document.getElementById('sayit-button');
btnSubmit.addEventListener('click', () => {
	codeMirror.setValue('');
	hideCodeMode();
}, true);

codeMirror.on('change', updateInput);

function updateInput() {
	let lines = codeMirror.getValue();
	if (lines) {
		input.value = lines.split(/\r\n|\n/g).map(line => `    ${line}`).join('\r\n');
	} else {
		input.value = '';
	}
}

function parseKeydown(event) {
	if (event.ctrlKey && event.which === 75) { // Ctrl + k toggles codeMode
		toggleCodeMode();
		stopEvent(event);
	} else if (event.ctrlKey && event.which === 13 && input.hidden) { // ctrl + enter on code mode sends.
		btnSubmit.click(); // trigger send.
	} else if (event.which === 27 && input.hidden) { // Escape key hides
		codeMirror.setValue('');
		toggleCodeMode();
		stopEvent(event);
	}
}

function stopEvent(event) {
	event.stopImmediatePropagation();
	event.preventDefault();
}

function changeMode() {
	let mode = modeSelect.value;
	codeMirror.setOption('mode', mode);
	window.localStorage.setItem(storageKey, mode);
}

function toggleCodeMode() {
	if (input.hidden) {
		hideCodeMode();
	} else {
		showCodeMode();
	}
}

function showCodeMode() {
	input.hidden = true;
	codeMirror.display.wrapper.hidden = false;
	codeMirror.setValue(input.value);
	codeMirror.focus();
	modeSelect.hidden = false;
}

function hideCodeMode() {
	updateInput();
	input.hidden = false;
	input.focus();
	if (input.value) {
		input.value = input.value.split(/\r\n|\n/g).map(line => {
			if (line.substr(0, 4) === '    ') {
				return line.slice(4);
			} else {
				console.log('how did I even hit');
				return line;
			}
		}).join('\r\n');
	}
	modeSelect.hidden = true;
	codeMirror.display.wrapper.hidden = true;
}

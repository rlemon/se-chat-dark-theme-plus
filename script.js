const defaults = {

	base_css: true,						// the base dark theme css

	inline_youtube: true,				// makes youtube videos play inline the chat

	collapse_onebox: true, 				// can collapse

	collapse_onebox_default: false, 	// default option for collapse

	pause_youtube_on_collapse: true, 	// default option for pausing youtube on collapse

	user_color_bars: true,				// show colored bars above users message blocks

	fish_spinner: true,					// fish spinner is best spinner

	inline_imgur: true,					// inlines webm,gifv,mp4 content from imgur

	visualize_hex: true,				// underlines hex codes with their colour values

	syntax_highlight_code: true,		// guess at language and highlight the code blocks

	emoji_translator: true,				// emoji translator for INPUT area

	code_mode_editor: true				// uses CodeMirror for your code inputs


};

const fileLocations = {
	inline_youtube: ['js/inline_youtube.js'],
	collapse_onebox: ['js/collapse_onebox.js'],
	user_color_bars: ['js/user_color_bars.js'],
	fish_spinner: ['js/fish_spinner.js'],
	inline_imgur: ['js/inline_imgur.js'],
	visualize_hex: ['js/visualize_hex.js'],
	syntax_highlight_code: ['js/highlight.js', 'js/syntax_highlight_code.js'],
	emoji_translator: ['js/emojidata.js', 'js/emoji_translator.js'],
	code_mode_editor: ['CodeMirror/js/codemirror.js',
						'CodeMirror/mode/cmake/cmake.js',
						'CodeMirror/mode/cobol/cobol.js',
						'CodeMirror/mode/coffeescript/coffeescript.js',
						'CodeMirror/mode/commonlisp/commonlisp.js',
						'CodeMirror/mode/css/css.js',
						'CodeMirror/mode/dart/dart.js',
						'CodeMirror/mode/go/go.js',
						'CodeMirror/mode/groovy/groovy.js',
						'CodeMirror/mode/haml/haml.js',
						'CodeMirror/mode/haskell/haskell.js',
						'CodeMirror/mode/htmlembedded/htmlembedded.js',
						'CodeMirror/mode/htmlmixed/htmlmixed.js',
						'CodeMirror/mode/jade/jade.js',
						'CodeMirror/mode/javascript/javascript.js',
						'CodeMirror/mode/lua/lua.js',
						'CodeMirror/mode/markdown/markdown.js',
						'CodeMirror/mode/mathematica/mathematica.js',
						'CodeMirror/mode/nginx/nginx.js',
						'CodeMirror/mode/pascal/pascal.js',
						'CodeMirror/mode/perl/perl.js',
						'CodeMirror/mode/php/php.js',
						'CodeMirror/mode/puppet/puppet.js',
						'CodeMirror/mode/python/python.js',
						'CodeMirror/mode/ruby/ruby.js',
						'CodeMirror/mode/sass/sass.js',
						'CodeMirror/mode/scheme/scheme.js',
						'CodeMirror/mode/shell/shell.js' ,
						'CodeMirror/mode/sql/sql.js',
						'CodeMirror/mode/swift/swift.js',
						'CodeMirror/mode/twig/twig.js',
						'CodeMirror/mode/vb/vb.js',
						'CodeMirror/mode/vbscript/vbscript.js',
						'CodeMirror/mode/vhdl/vhdl.js',
						'CodeMirror/mode/vue/vue.js',
						'CodeMirror/mode/xml/xml.js',
						'CodeMirror/mode/xquery/xquery.js',
						'CodeMirror/mode/yaml/yaml.js',
						'js/code_mode_editor.js']
};


// right now I assume order is correct because I'm a terrible person. make an order array or base it on File Locations and make that an array

// inject the observer and the utils always. then initialize the options.
injector([{type: 'js', location: 'js/observer.js'},{type: 'js', location: 'js/utils.js'}], _ => chrome.storage.sync.get(defaults, init));

function init(options) {
	// inject the options for the plugins themselves.
	const opts = document.createElement('script');
	opts.textContent = `
		const options = ${JSON.stringify(options)};
	`;
	document.body.appendChild(opts);
	// now load the plugins.
	const loading = [];
	if( !options.base_css ) {
		document.documentElement.classList.add('nocss');
	}
	delete options.base_css;
	for( const key of Object.keys(options) ) {
		if( !options[key] || !( key in fileLocations)) continue;
		for( const location of fileLocations[key] ) {
			const [,type] = location.split('.');
			loading.push({location, type});
		}
	}
	injector(loading, _ => {
		const drai = document.createElement('script');
		drai.textContent = `
		if( document.readyState === 'complete' ) {
			DOMObserver.drain();
		} else {
			window.onload = _ => DOMObserver.drain();
		}
		`;
		document.body.appendChild(drai);
	});
}

function injector([first, ...rest], cb) {
	if( !first ) return cb();
	if( first.type === 'js' ) {
		injectJS(first.location, _ => injector(rest, cb));
	} else {
		injectCSS(first.location, _ => injector(rest, cb));
	}
}

function injectCSS(file, cb) {
	const elm = document.createElement('link');
	elm.rel = 'stylesheet';
	elm.type = 'text/css';
	elm.href = chrome.extension.getURL(file);
	elm.onload = cb;
	document.head.appendChild(elm);
}

function injectJS(file, cb) {
	const elm = document.createElement('script');
	elm.type = 'text/javascript';
	elm.src = chrome.extension.getURL(file);
	elm.onload = cb;
	document.body.appendChild(elm);
}
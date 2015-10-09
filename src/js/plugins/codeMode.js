(function() {
    "use strict";
    let codeMirror;
    let input = document.getElementById('input');
    let btnSubmit = document.getElementById('sayit-button');
    let modeSelect = document.createElement('select');
    let storageKey = 'se-dark-theme-chat-codemirror-mode-' + Number(/\d+/.exec(location)[0]);
    let currentMode = window.localStorage.getItem(storageKey) || 'javascript';
    modeSelect.innerHTML = '<option value="apl">apl</option><option value="asciiarmor">asciiarmor</option><option value="asn.1">asn.1</option><option value="asterisk">asterisk</option><option value="brainfuck">brainfuck</option><option value="clike">c</option><option value="clike">c++</option><option value="clike">clike</option><option value="clike">ceylon</option><option value="clojure">clojure</option><option value="cmake">cmake</option><option value="cobol">cobol</option><option value="coffeescript">coffeescript</option><option value="commonlisp">commonlisp</option><option value="css">css</option><option value="cypher">cypher</option><option value="d">d</option><option value="dart">dart</option><option value="diff">diff</option><option value="django">django</option><option value="dockerfile">dockerfile</option><option value="dtd">dtd</option><option value="dylan">dylan</option><option value="ebnf">ebnf</option><option value="ecl">ecl</option><option value="eiffel">eiffel</option><option value="elm">elm</option><option value="erlang">erlang</option><option value="factor">factor</option><option value="forth">forth</option><option value="fortran">fortran</option><option value="gas">gas</option><option value="gfm">gfm</option><option value="gherkin">gherkin</option><option value="go">go</option><option value="groovy">groovy</option><option value="haml">haml</option><option value="handlebars">handlebars</option><option value="haskell">haskell</option><option value="haxe">haxe</option><option value="htmlembedded">htmlembedded</option><option value="htmlmixed">htmlmixed</option><option value="http">http</option><option value="idl">idl</option><option value="index.html">index.html</option><option value="jade">jade</option><option value="clike">java</option><option value="javascript">javascript</option><option value="jinja2">jinja2</option><option value="julia">julia</option><option value="clike">kotlin</option><option value="livescript">livescript</option><option value="lua">lua</option><option value="markdown">markdown</option><option value="mathematica">mathematica</option><option value="meta.js">meta.js</option><option value="mirc">mirc</option><option value="mllike">mllike</option><option value="modelica">modelica</option><option value="mscgen">mscgen</option><option value="mumps">mumps</option><option value="nginx">nginx</option><option value="nsis">nsis</option><option value="ntriples">ntriples</option><option value="clike">objective-c</option><option value="octave">octave</option><option value="oz">oz</option><option value="pascal">pascal</option><option value="pegjs">pegjs</option><option value="perl">perl</option><option value="php">php</option><option value="pig">pig</option><option value="properties">properties</option><option value="puppet">puppet</option><option value="python">python</option><option value="q">q</option><option value="r">r</option><option value="rpm">rpm</option><option value="rst">rst</option><option value="ruby">ruby</option><option value="rust">rust</option><option value="sass">sass</option><option value="clike">scala</option><option value="scheme">scheme</option><option value="shell">shell</option><option value="sieve">sieve</option><option value="slim">slim</option><option value="smalltalk">smalltalk</option><option value="smarty">smarty</option><option value="solr">solr</option><option value="soy">soy</option><option value="sparql">sparql</option><option value="spreadsheet">spreadsheet</option><option value="sql">sql</option><option value="stex">stex</option><option value="stylus">stylus</option><option value="swift">swift</option><option value="tcl">tcl</option><option value="textile">textile</option><option value="tiddlywiki">tiddlywiki</option><option value="tiki">tiki</option><option value="toml">toml</option><option value="tornado">tornado</option><option value="troff">troff</option><option value="ttcn">ttcn</option><option value="ttcn-cfg">ttcn-cfg</option><option value="turtle">turtle</option><option value="twig">twig</option><option value="vb">vb</option><option value="vbscript">vbscript</option><option value="velocity">velocity</option><option value="verilog">verilog</option><option value="vhdl">vhdl</option><option value="vue">vue</option><option value="xml">xml</option><option value="xquery">xquery</option><option value="yaml">yaml</option><option value="z80">z80</option>';
    [...modeSelect.options].forEach(option => {
        if (option.value === currentMode) {
            option.selected = true;
        } else {
            option.selected = false;
        }
    });
    modeSelect.addEventListener('change', changeMode);
    modeSelect.hidden = true;
    document.getElementById('chat-buttons').appendChild(modeSelect);
    window.addEventListener('keydown', parseKeydown, true);
    btnSubmit.addEventListener('click', () => {
        codeMirror.setValue('');
        toggleCodeMode();
    }, true);
    codeMirror = window.CodeMirror(el => {
        el.hidden = true;
        input.parentNode.insertBefore(el, input);
    }, {
        value: input.value,
        theme: 'monokai',
        mode: 'javascript'
    });
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
        if (event.ctrlKey && event.which === 75) {
            toggleCodeMode();
            stopEvent(event);
        } else if (event.ctrlKey && event.which === 13 && input.hidden) { // ctrl + enter on code mode sends.
            btnSubmit.click(); // trigger send. 
        } else if (event.which === 27 && input.hidden) {
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
        } else {
            input.hidden = true;
            codeMirror.display.wrapper.hidden = false;
            codeMirror.setValue(input.value);
            codeMirror.focus();
            modeSelect.hidden = false;
        }
    }
}());
//.setOption("mode", language);
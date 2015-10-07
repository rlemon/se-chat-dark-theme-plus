(function() {
    "use strict";

    let codeMirror, isCodeMode = false;
    let input = document.getElementById('input');
    let btnSubmit = document.getElementById('sayit-button');

    // function loadScript(url) {
    //     let elm = document.createElement('script');
    //     elm.onload = response => {
    //         console.log(url, 'loaded');
    //         it.next(response);
    //     };
    //     elm.src = url;
    //     document.body.appendChild(elm);
    // }
    // // yes, code duplication. bite me. 
    // function loadStyle(url) {
    //     let elm = document.createElement('link');
    //     elm.onload = response => {
    //         console.log(url, 'loaded');
    //         it.next(response);
    //     };
    //     elm.href = url;
    //     elm.rel = 'stylesheet';
    //     document.head.appendChild(elm);
    // }

    // function *main() {
    //     yield loadScript(chrome.extension.getURL('CodeMirror/js/codemirror.js'));
    //     yield loadStyle(chrome.extension.getURL('CodeMirror/css/codemirror.css'));
    //     yield loadScript(chrome.extension.getURL('CodeMirror/mode/javascript/javascript.js'));
        
    //     setTimeout(setup, 2000);
    // }

    setup();

    function setup() {
        window.addEventListener('keydown', parseKeydown, true);
        btnSubmit.addEventListener('click', toggleCodeMode, true);
        codeMirror = window.CodeMirror(el => {
            el.hidden = true;
            input.parentNode.insertBefore(el, input);
        }, {
            value: input.value,
            theme: 'monokai'
        });
        codeMirror.on('change', updateInput);
    }

    function updateInput() {
        let lines = codeMirror.getValue();
        if( lines ) {
            input.value = lines.split(/\r\n|\n/g).map(line=>`    ${line}`).join('\r\n');
        }
    }

    function parseKeydown(event) {
        if( event.ctrlKey && event.which === 75 ) {
            toggleCodeMode();
            event.stopImmediatePropagation();
            event.preventDefault();
            return false;
        }
    }

    function toggleCodeMode() {
        if( input.hidden ) {
            updateInput(); 
            input.hidden = false;
            input.focus();
            if( input.value ) {
                input.value = input.value.split(/\r\n|\n/g).map(line=>{
                    if( line.substr(0, 4) === '    ' ) {
                        return line.slice(4);
                    } else { 
                        console.log('how did I even hit');
                        return line;
                    }
                }).join('\r\n');
            }
            codeMirror.display.wrapper.hidden = true;
        } else {
            input.hidden = true;
            codeMirror.display.wrapper.hidden = false;
            codeMirror.setValue(input.value);
            codeMirror.focus();
        }
    }

}());

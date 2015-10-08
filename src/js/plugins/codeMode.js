(function() {
    "use strict";

    let codeMirror, isCodeMode = false;
    let input = document.getElementById('input');
    let btnSubmit = document.getElementById('sayit-button');

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
        if( lines ) {
            input.value = lines.split(/\r\n|\n/g).map(line=>`    ${line}`).join('\r\n');
        } else {
            input.value = '';
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

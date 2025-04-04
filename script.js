const elements = {
    inputCode: document.querySelector('#inputCode'),
    outputCode: document.querySelector('#outputCode'),
    lineComment: document.querySelector('#lineComment'),
    escapeSymbol: document.querySelector('#escapeSymbol'),
    blockStart: document.querySelector('#blockStart'),
    blockEnd: document.querySelector('#blockEnd'),
    trimWhitespace: document.querySelector('#trimWhitespace'),
    presetsContainer: document.querySelector('.presets')
};

const presets = {
    'C/C++/C#': { line: '//', escape: '\\', blockStart: '/*', blockEnd: '*/' },
    'PHP': { line: '//', escape: '\\', blockStart: '/*', blockEnd: '*/' },
    'Java': { line: '//', escape: '\\', blockStart: '/*', blockEnd: '*/' },
    'JavaScript': { line: '//', escape: '\\', blockStart: '/*', blockEnd: '*/' },
    'Python': { line: '#', escape: '\\', blockStart: '"""', blockEnd: '"""' },
    'HTML': { line: '', escape: '', blockStart: '<!--', blockEnd: '-->' },
    'CSS': { line: '', escape: '', blockStart: '/*', blockEnd: '*/' },
    'SQL': { line: '--', escape: '', blockStart: '/*', blockEnd: '*/' },
    'MATLAB': { line: '%', escape: '', blockStart: '/*', blockEnd: '*/' },
    'Ruby': { line: '#', escape: '\\', blockStart: '=begin', blockEnd: '=end' },
    'Swift': { line: '//', escape: '\\', blockStart: '/*', blockEnd: '*/' },
    'Assembly': { line: ';', escape: '', blockStart: '', blockEnd: '' }
};

function setPreset(lang) {
    const preset = presets[lang];
    elements.lineComment.value = preset.line;
    elements.escapeSymbol.value = preset.escape;
    elements.blockStart.value = preset.blockStart;
    elements.blockEnd.value = preset.blockEnd;
}

function generatePresetButtons() {
    for (const lang in presets) {
        const button = document.createElement('button');
        button.classList.add('preset-btn');
        button.textContent = lang;
        button.onclick = () => setPreset(lang);
        elements.presetsContainer.appendChild(button);
    }
}

function removeComments() {
    const input = elements.inputCode.value;
    const lineComment = elements.lineComment.value;
    const escapeSymbol = elements.escapeSymbol.value;
    const blockStart = elements.blockStart.value;
    const blockEnd = elements.blockEnd.value;
    const trimWhitespace = elements.trimWhitespace.checked;

    let output = '';
    let i = 0;
    let inString = false;
    let stringChar = '';
    let inBlockComment = false;
    let inLineComment = false;

    while (i < input.length) {
        if (isInString(input, i, inString, stringChar)) {
            inString = handleString(input, i, inString, stringChar, output);
            continue;
        }

        if (inString) {
            i++;
            continue;
        }

        if (handleBlockComment(input, i, blockStart, blockEnd, inBlockComment)) {
            inBlockComment = true;
            i += blockStart.length;
            continue;
        }

        if (handleBlockCommentEnd(input, i, blockEnd, inBlockComment)) {
            inBlockComment = false;
            i += blockEnd.length;
            continue;
        }

        if (inBlockComment) {
            i++;
            continue;
        }

        if (handleLineComment(input, i, lineComment, inLineComment, output)) {
            inLineComment = true;
            i += lineComment.length;
            continue;
        }

        if (inLineComment && input[i] === '\n') {
            inLineComment = false;
            output += input[i];
            i++;
            continue;
        }

        if (inLineComment) {
            i++;
            continue;
        }

        output += input[i];
        i++;
    }

    if (trimWhitespace) {
        output = output.replace(/[ \t]+$/gm, '');
    }

    elements.outputCode.value = output.trim();
}

function isInString(input, i, inString, stringChar) {
    return !inString && (input[i] === '"' || input[i] === "'" || input[i] === "`") && (stringChar !== input[i]);
}

function handleString(input, i, inString, stringChar, output) {
    if (!inString) {
        inString = true;
        stringChar = input[i];
        output += input[i];
        return true;
    } else if (input[i] === stringChar && i > 0 && input[i-1] !== elements.escapeSymbol.value) {
        inString = false;
    }
    output += input[i];
    return false;
}

function handleBlockComment(input, i, blockStart, blockEnd, inBlockComment) {
    return !inBlockComment && blockStart && input.startsWith(blockStart, i);
}

function handleBlockCommentEnd(input, i, blockEnd, inBlockComment) {
    return inBlockComment && blockEnd && input.startsWith(blockEnd, i);
}

function handleLineComment(input, i, lineComment, inLineComment, output) {
    return !inLineComment && lineComment && input.startsWith(lineComment, i);
}

elements.inputCode.addEventListener('input', removeComments);
generatePresetButtons();

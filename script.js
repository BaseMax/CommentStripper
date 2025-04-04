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
        if (isInBlockComment(input, i, blockStart, blockEnd)) {
            i = handleBlockComment(input, i, blockStart, blockEnd);
            continue;
        }

        if (isInLineComment(input, i, lineComment)) {
            i = handleLineComment(input, i);
            continue;
        }

        if (isInString(input, i, stringChar, escapeSymbol, inString)) {
            i = handleString(input, i, escapeSymbol, stringChar, inString);
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

function isInBlockComment(input, i, blockStart, blockEnd) {
    return !inBlockComment && blockStart && input.startsWith(blockStart, i);
}

function handleBlockComment(input, i, blockStart, blockEnd) {
    if (!inBlockComment && blockStart && input.startsWith(blockStart, i)) {
        inBlockComment = true;
        i += blockStart.length;
    }
    if (inBlockComment && blockEnd && input.startsWith(blockEnd, i)) {
        inBlockComment = false;
        i += blockEnd.length;
    }
    return i;
}

function isInLineComment(input, i, lineComment) {
    return !inLineComment && lineComment && input.startsWith(lineComment, i);
}

function handleLineComment(input, i) {
    if (inLineComment && input[i] === '\n') {
        inLineComment = false;
        output += '\n';
        i++;
    }
    return i;
}

function isInString(input, i, stringChar, escapeSymbol, inString) {
    return !inString && (input[i] === '"' || input[i] === "'" || input[i] === "`");
}

function handleString(input, i, escapeSymbol, stringChar, inString) {
    if (inString) {
        output += input[i];
        if (input[i] === stringChar && (i === 0 || input[i - 1] !== escapeSymbol)) {
            inString = false;
            stringChar = '';
        }
    }
    return i + 1;
}

elements.inputCode.addEventListener('input', removeComments);

generatePresetButtons();

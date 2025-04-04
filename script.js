const presets = {
    'c': { line: '//', escape: '\\', blockStart: '/*', blockEnd: '*/' },
    'php': { line: '//', escape: '\\', blockStart: '/*', blockEnd: '*/' },
    'java': { line: '//', escape: '\\', blockStart: '/*', blockEnd: '*/' },
    'js': { line: '//', escape: '\\', blockStart: '/*', blockEnd: '*/' },
    'python': { line: '#', escape: '\\', blockStart: '"""', blockEnd: '"""' },
    'html': { line: '', escape: '', blockStart: '<!--', blockEnd: '-->' },
    'css': { line: '', escape: '', blockStart: '/*', blockEnd: '*/' },
    'sql': { line: '--', escape: '', blockStart: '/*', blockEnd: '*/' },
    'matlab': { line: '%', escape: '', blockStart: '/*', blockEnd: '*/' },
    'ruby': { line: '#', escape: '\\', blockStart: '=begin', blockEnd: '=end' },
    'swift': { line: '//', escape: '\\', blockStart: '/*', blockEnd: '*/' }
};

function setPreset(lang) {
    const preset = presets[lang];
    document.getElementById('lineComment').value = preset.line;
    document.getElementById('escapeSymbol').value = preset.escape;
    document.getElementById('blockStart').value = preset.blockStart;
    document.getElementById('blockEnd').value = preset.blockEnd;
}

function removeComments() {
    const input = document.getElementById('inputCode').value;
    const lineComment = document.getElementById('lineComment').value;
    const escapeSymbol = document.getElementById('escapeSymbol').value;
    const blockStart = document.getElementById('blockStart').value;
    const blockEnd = document.getElementById('blockEnd').value;

    let output = '';
    let i = 0;
    let inString = false;
    let stringChar = '';
    let inBlockComment = false;
    let inLineComment = false;

    while (i < input.length) {
        if (!inBlockComment && !inLineComment && (input[i] === '"' || input[i] === "'")) {
            if (!inString) {
                inString = true;
                stringChar = input[i];
                output += input[i];
                i++;
                continue;
            } else if (input[i] === stringChar && i > 0 && input[i-1] !== escapeSymbol) {
                inString = false;
            }
        }

        if (inString) {
            output += input[i];
            i++;
            continue;
        }

        if (!inLineComment && blockStart && input.startsWith(blockStart, i)) {
            inBlockComment = true;
            i += blockStart.length;
            continue;
        }
        if (inBlockComment && blockEnd && input.startsWith(blockEnd, i)) {
            inBlockComment = false;
            i += blockEnd.length;
            continue;
        }
        if (inBlockComment) {
            i++;
            continue;
        }

        if (!inBlockComment && lineComment && input.startsWith(lineComment, i)) {
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

    document.getElementById('outputCode').value = output.trim();
}

setPreset('js');

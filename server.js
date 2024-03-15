const express = require('express');
const app = express();
const port = 3000;
const figlet = require('figlet');
const pi = require('pi-digits');

pi.digits.unshift("3",".");

function createPiStringForSubstitution(asciiArt) {
    const hashCount = (asciiArt.match(/#/g) || []).length;
    let piString = pi.digits.join("");
    const piStringLength = pi.digits.length;
    
    if (hashCount <= piStringLength) {
        piString = pi.digits.slice(0, hashCount).join('');
    } else {
        // Calculate how many full cycles of pi digits are needed
        const fullCycles = Math.floor(hashCount / piStringLength);
        const remainder = hashCount % piStringLength;
        
        // Create the piString with full cycles of pi digits
        const fullPiString = pi.digits.join('');
        piString = fullPiString.repeat(fullCycles);
        
        // Append the remainder if needed
        if (remainder > 0) {
            piString += pi.digits.slice(0, remainder).join('');
        }
    }

    return piString;
}

function createAsciiArt(resultText, piArray) {
    const data = figlet.textSync(resultText, {
        font: 'banner3',
        width: 80
    })
    const fillText = createPiStringForSubstitution(data);
    return replaceHashWithFillText(data, fillText);
}

function replaceHashWithFillText(asciiArt, fillText) {
    let fillIndex = 0;
    // Replace each '#' with the next character from fillText
    return asciiArt.replace(/#/g, () => fillText[fillIndex++ % fillText.length]);
}

app.get('/:text', (req, res) => {
    // Capture the text from the route parameter
    const userText = req.params.text;
    console.log(userText);
    // Use the captured text as the second parameter of createAsciiArt()
    const piArt = createAsciiArt(userText);

    // Surround piArt with <pre> tags
    const responseContent = `<pre style="font-size: 20px;">${piArt}</pre>`;

    res.send(responseContent);
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


let fs = require("fs");

let readFile = function (path)
{
    return fs.readFileSync(path).toString();
};

let writeFile = function (path, text)
{
    fs.writeFileSync(path, text);
};

/**
 * Function to know if it's an alphabet letter
 * @return boolean
 * @param char
 */
var isLetter = function (char)
{
    return (char >= "a" && char <= "z") ||
        (char >= "A" && char <= "Z");
};

/**
 * Function to know if it's a special characters
 * @return boolean
 * @param char
 */
let isSpecialChar = function (char)
{
    return (char >= "!" && char <= "/");
};

/**
 * Splits a sentence and returns an array
 * of these words. (& special character)
 * @return array
 * @param text
 */
let cutSentence = function (text)
{
    let result = [];
    let start = 0;
    while (start < text.length)
    {
        if (isLetter(text.charAt(start)) || !isNaN(text.charAt(start)))
        {
            let i = start + 1;
            while (i < text.length && isLetter(text.charAt(i)))
                i++;
            result.push(text.slice(start, i));
            start = i + 1;
        }
        else
            start++;
    }
    return result;
};

let getLinebreakPos = function (array, max)
{
    let line = "";
    let word = 0;

    for (let u = 0; u < array.length; u++)
    {
        if(line.length <= max)
        {
            if(line.length === max)
                line += array[u];
            else line += array[u] + " ";
            word++;
        }
        else break;
    }
    return word;
};

let isNaturalNumber = function (n)
{
    n = n.toString(); // Force the value in case it is not
    let n1 = Math.abs(n),
        n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
};

let fillSentence = function (ligne, nbColonnes)
{
    var nbEspaces = ligne.split(" ").length - 1;
    var ligne2 = "";
    var max = (nbColonnes - ligne.length);
    var espace = " ";
    var totalFill = new Array(max + 1).join(espace);
    var espFill = totalFill.length/nbEspaces;
    var espacement;
    var espacement2;


    if(espFill == Math.floor(espFill))
    {
        espacement = new Array(espFill + 1).join(espace);
        for(var x = 0; x < ligne.length; x++)
        {
            var caractere = ligne.charAt(x);
            if(caractere == " "){
                caractere += espacement;
            }
            ligne2 += caractere;
        }
    }
    else {
        espacement = new Array(Math.ceil(espFill) + 1).join(espace);
        espacement2 = new Array(Math.floor(espFill) + 1).join(espace);
        for(var x = 0; x < ligne.length; x++)
        {
            var caractere = ligne.charAt(x);
            if(caractere == " " && nbEspacesQuiDiminue > 1)
            {
                caractere += espacement;
                nbEspacesQuiDiminue = nbEspacesQuiDiminue - 1;
            }
            else if(caractere == " ")
            {
                caractere += espacement2;
            }
            ligne2 += caractere;
        }
    }
    return ligne2;
};

/**
 * If we can have the same number of words in
 * each line, this function do it.
 *
 * @param textArray
 * @param lineArray
 * @returns array of text line
 */
let adjustWordPerLine = function (textArray, lineArray)
{
    let d = textArray.length / lineArray.length;
    let array = [];

    if (isNaturalNumber(d))
    {
        for (let v = 0; v < lineArray.length; v++)
        {
            let line = "";
            for (let i = 0; i < d; i++)
            {
                if(i === (d-1)) line += textArray[i];
                else line += textArray[i] + " ";
            }
            array.push(line);
            textArray = textArray.slice(d, textArray.length);
        }
    }
    else
        array = lineArray;
    return array;
};

/**
 * Create an array of sentence rows with
 * a maximum of columns.
 *
 * @param sentence
 * @param max
 * @return array new sentence
 */
let getProvedText = function (sentence, max)
{
    let text = [];
    let wordsArray = cutSentence(sentence); // Put each word of the sentence in array

    if(sentence.length <= max)
    {
        text.push(sentence);
        return text;
    }

    while(wordsArray && wordsArray.length > 0)
    {
        let line = "";
        let maxWord = getLinebreakPos(wordsArray, max);

        for (let u = 0; u < maxWord; u++)
        {
            if(u === maxWord - 1)
                line += wordsArray[u];
            else line += wordsArray[u] + " ";
        }
        text.push(line);
        wordsArray = wordsArray.slice(maxWord, wordsArray.length);
    }

    return text;
};


let justifierFichier  = function (inputFile, outputFile, maxRows)
{
    let text = readFile(inputFile);
    let wordsTextArray = cutSentence(text);

    let provedText = getProvedText(text, maxRows);
    let adjustedLines = adjustWordPerLine(wordsTextArray, provedText);

    let newTextArr = [];
    for (let y = 0; y < adjustedLines.length; y++)
        newTextArr.push(fillSentence(adjustedLines[y], maxRows));

    let newTextString = "";
    for (let z = 0; z < newTextArr.length; z++)
        newTextString += newTextArr[z] + "\n";

    writeFile(outputFile, newTextString);

    print(readFile(outputFile));
};

let print = function (x)
{
    console.log(x);
};

justifierFichier("test.txt", "test1.txt", 15);

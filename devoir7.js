/*
* Maël LE PETIT - (20143452)
* For IFT1015
* A program that reads a text file and returns a justified version of it.
*   - It cuts the rows so that they do not exceed the desired number of columns.
*   - And inserts additional spaces so that each line ends in the same column.
*/

let fs = require("fs"); // from node.js

/**
 * Get the content of a file
 * @param path
 * @returns {string}
 */
let readFile = function (path)
{
    return fs.readFileSync(path).toString();
};

/**
 * Write in file
 * @param path
 * @param text
 */
let writeFile = function (path, text)
{
    fs.writeFileSync(path, text);
};

/**
 * Function to know if it's an alphabet letter
 * @return {boolean}
 * @param char
 */
let isLetter = function (char)
{
    return (char >= "a" && char <= "z") ||
        (char >= "A" && char <= "Z");
};

/**
 * Function to know if it's a special characters
 * @return {boolean}
 * @param char
 */
let isSpecialChar = function (char)
{
    return (char >= "!" && char <= "/");
};

/**
 * Splits a sentence and returns an array
 * of these words.
 * @return {array}
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

/**
 * Get the number of words to count before cutting the sentence.
 * @param array
 * @param max
 * @returns {number}
 */
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

/**
 * Check if it's a natural number (O to Infinity)
 * @param n
 * @returns {boolean}
 */
let isNaturalNumber = function (n)
{
    n = n.toString(); // Force the value in case it is not
    let n1 = Math.abs(n),
        n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
};

/**
 * Fill in the sentence by spaces to the last column
 *
 * @param line
 * @param nbrRows
 * @returns {string} new line
 */
let fillSentence = function (line, nbrRows)
{
    let nbrSpaces = line.split(" ").length - 1;
    let max = (nbrRows - line.length);
    let nbrDecreasingSpace = nbrSpaces;
    let line2 = "";
    let space = " ";
    let totalFill = new Array(max + 1).join(space);
    let escFill = totalFill.length / nbrSpaces;
    let gap1;
    let gap2;
    let char = "";

    if(escFill === Math.floor(escFill))
    {
        gap1 = new Array(escFill + 1).join(space);
        for(let x = 0; x < line.length; x++)
        {
            char = line.charAt(x);
            if(char === " ")
                char += gap1;
            line2 += char;
        }
    }
    else {
        gap1 = new Array(Math.ceil(escFill) + 1).join(space);
        gap2 = new Array(Math.floor(escFill) + 1).join(space);

        for(let y = 0; y < line.length; y++)
        {
            char = line.charAt(y);
            if(char === " " && nbrDecreasingSpace > 1)
            {
                char += gap1;
                nbrDecreasingSpace = nbrDecreasingSpace - 1;
            }
            else if(char === " ")
                char += gap2;
            line2 += char;
        }
    }
    return line2;
};

/**
 * If we can have the same number of words in
 * each line, this function do it.
 *
 * @param textArray
 * @param lineArray
 * @returns {array} of text line
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
 * @return {array} new sentence
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

/**
 * Main function
 *
 * @param inputFile
 * @param outputFile
 * @param maxRows
 * @return {string}
 */
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
    return readFile(outputFile);
};

/**
 * Simplifies writing in the console
 * @param x
 */
let print = function (x)
{
    console.log(x);
};

/**
 * Function who checks the limits of the program.
 */
let tests = function ()
{
    //TODO tests unitaires
};
tests();

/* TEST
    test.txt :
        the quick brown fox jumps over the lazy dog

    proveFile.js :
        print(justifierFichier("test.txt", "test1.txt", 15));
        console:
            the quick brown
            fox  jumps over
            the   lazy  dog
*/

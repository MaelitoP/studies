/*
* Maël LE PETIT - (20143452)
* For IFT1015
*  Program that takes as a parameter a 2D data matrix and returns a
*  text where all the elements of the matrix are arranged in columns in
*  a grid built with -, |, +, spaces and line breaks.
*/

let fs = require("fs"); // nodejs

/**
 * Print a text in console.
 * @param text
 */
function print (text)
{
    console.log(text);
}

/**
 * Create a new array by instructions setup in
 * the function.
 * @param tab
 * @param fn
 * @returns {Array}
 */
function map (tab, fn)
{
    let result = [];
    result.forEach(function (x) { result.push(fn(tab[x])); });
    return result;
}

/**
 * Created the same 2D table as input, replacing
 * the values by the size (number of characters).
 * @param array
 * @returns {Array}
 */
function getLengthValue2DArray (array)
{
    let sizeArray = [];
    array.forEach(element => {
        let arr = element.map(function (x) {
            if (typeof x === 'string' || x instanceof String)
                return x.length;
            else
                return Math.ceil(Math.log10(x + 1));
        });
        sizeArray.push(arr);
    });
    return sizeArray;
}

/**
 * Get a table with the highest value of each column.
 * @param array
 * @returns {Array}
 */
function getMaxElementsSizeOf2DArray (array)
{
    let maxValues = [];
    array.forEach(element => {  maxValues = element.map(function (x) { return 0; }); });
    array.forEach(element => {
        element.forEach(function (x) {
            if(x > maxValues[element.indexOf(x)])
                maxValues[element.indexOf(x)] = x;
        })
    });

    return maxValues;
}

/**
 * Fill in the sentence by spaces to the last column;
 * @param word
 * @param nbrRows
 * @returns {string} new line
 */
function fillWord (word, nbrRows)
{
    let max = (nbrRows - word.length);
    let space = " ";

    if(word.length === nbrRows)
        return word;
    else
        return Array(max + 1).join(space) + word;
}

/**
 * Get all rows in a table
 * @param array
 * @returns {Array}
 */
function make (array)
{
    let lines = [];
    let lengthOfContentArr = getLengthValue2DArray(array);
    let maxValues = getMaxElementsSizeOf2DArray(lengthOfContentArr);

    // Write main line
    let mainLine = "+";
    maxValues.forEach(function (x) {
        mainLine += Array(x).fill("-").join("") + "+";
    });
    lines.push(mainLine);

    // Write all other lines
    array.forEach(function (x) {
        let line = "|";
        maxValues.forEach(nbrRows => {
            let value = x[maxValues.indexOf(nbrRows)];
            if (typeof value === 'string' || value instanceof String)
                line += fillWord(value, nbrRows) + "|";
            else
                line += fillWord(value.toString(), nbrRows) + "|";
        });
        lines.push(line);
        lines.push(mainLine)
    });

    return lines;
}

/**
 * Display a text where all the elements of the matrix
 * are arranged in columns in a constructed grid.
 * @param array2D
 * @return {string}
 */
function grilleMat (array2D)
{
    let string = "",
        stringArray = make(array2D);

    stringArray.forEach(lines => {
        string += lines + "\n";
    });

    return string;
}

let i = [["oranges",5],["kiwis",1000]];
print(grilleMat(i));

/*
* print(grilleMat([["oranges",5],["kiwis",1000]]);
*
* Console:
*   +-------+----+
*   |oranges|   5|
*   +-------+----+
*   |  kiwis|1000|
*   +-------+----+
*
 */

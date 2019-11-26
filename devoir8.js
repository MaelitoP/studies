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
 * Get a table with the highest value of each column.
 * @param array
 * @returns {Array}
 */
function getMaxElementsSizeOf2DArray (array)
{
    let maxValues = [];
    let c = 0;
    array.forEach(element => {  maxValues = element.map(function (x) { return 0; }); });
    array.forEach(element => {
        element.forEach(function (x) {
            if (c < element.length)
            {
                if (typeof x === 'string' || x instanceof String)
                {
                    if (x.length > maxValues[c])
                        maxValues[c] = x.length;
                }
                else if (Math.ceil(Math.log10(x + 1)) > maxValues[c])
                    maxValues[c] = Math.ceil(Math.log10(x + 1));
                c++;
            }
        });
        c = 0;
    });
    return maxValues;
}

/**
 * Fill in the word by spaces to the next column.
 * @param word
 * @param nbrRows
 * @returns {string} new line
 */
function fillWord (word, nbrRows)
{
    let max = (nbrRows - word.length);
    let space = " ";

    if(word.length === nbrRows)
    {
        return word;
    }
    else
    {
        return Array(max + 1).join(space) + word;
    }
}

/**
 * Get all rows in a table for 2D array
 * @param array
 * @returns {Array}
 */
function make (array)
{
    let lines = [];
    let maxValues = getMaxElementsSizeOf2DArray(array);

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
            {
                line += fillWord(value, nbrRows) + "|";
            }
            else
            {
                line += fillWord(value.toString(), nbrRows) + "|";
            }
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

function testGrilleMat ()
{
    console.assert(JSON.stringify(getMaxElementsSizeOf2DArray([["oranges", 5], ["kiwis", 1000]]) === JSON.stringify([7, 4])));
    console.assert(JSON.stringify(getMaxElementsSizeOf2DArray([[0, 5], [0, 1000], [1000, 1000], ["morty", 1000]]) === JSON.stringify([5, 4])));

    console.assert(fillWord("chicken", 7) === "chicken");
    console.assert(fillWord("", 7) === "       ");
    console.assert(fillWord("89", 3) === " 89");

    console.assert(JSON.stringify(grilleMat([["oranges", 5], ["kiwis", 1000]]) === JSON.stringify("+-------+----+\n|oranges|   5|\n+-------+----+\n|  kiwis|1000|\n+-------+----+")));
}

testGrilleMat();

/*
* print(grilleMat([["oranges",5],["kiwis",1000]]);
*
* Console:
*   +-------+----+
*   |oranges|   5|
*   +-------+----+
*   |  kiwis|1000|
*   +-------+----+
 */

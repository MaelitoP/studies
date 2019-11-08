/*
* Maël LE PETIT - (20143452)
* For IFT1015
* This program carries out the capitalization
* of a character string.
*/

/*
* Function to know if it's an alphabet letter
* @param character char
* @return boolean
*/
var isLetter = function (char) 
{
    return (char >= "a" && char <= "z") ||
           (char >= "A" && char <= "Z");
};

/*
* Function to know if it's a special characters
* @param character char
* @return boolean
*/
var isSpecialChar = function (char) 
{
    return (char >= "!" && char <= "/");
};

/*
* Splits a sentence and returns an array
* of these words. (& special character)
* @param string text
* @return array
*/
var cutSentence = function (text)
{
    var result = [];
    var start = 0;
    while (start < text.length)
    {
        if (isLetter(text.charAt(start)) || !isNaN(text.charAt(start))) 
        {
            var i = start+1;
            while (i < text.length && isLetter(text.charAt(i)))
                i++;
            result.push(text.slice(start, i));
            start = i+1;
        } 
        else
            start++;
    }
    return result;
};

/*
* Retrieve a table with the position of
* the special characters of a sentence
* @param string text
* @return array (type: [{pos: position, char: special char}] )
*/
var specialChar = function (text)
{
    var result = [];
    
    for(var v = 0; v < text.length; v++)
    {
        if(isSpecialChar(text.charAt(v))) // If the sentence contains special characters
                result.push({pos: v, char: text.charAt(v)}); // Save the position & characters
    }
    return result;
};


/*
* Capitalizes a sentence
* @param string text
* @return capitalized sentence
*/
var capitaliser = function (text)
{
    var wordsArray = cutSentence(text); // Put each word of the sentence in array
    var lowerAlpha = "abcdefghijklmnopqrstuvwxyz";
    var upperAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var newSentence = "";
    
    for(var i = 0; i < wordsArray.length; i++)
    {
        var currentWord = wordsArray[i];
        for(var j = 0; j < lowerAlpha.length; j++)
        {
            if((currentWord[0] == lowerAlpha[j]) || (currentWord[0] == upperAlpha[j]))
            {
                // First character of each word is replaced by a capital letter
                var capitWord = upperAlpha[j] + currentWord.slice(1, currentWord.length);
                wordsArray[i] = capitWord;
            }
        }
    }
    
    // Reposition each word to make a sentence
    newSentence = wordsArray[0];
    for(var k = 1; k < wordsArray.length; k++)
        newSentence += " " + wordsArray[k];
    
    var specialC = specialChar(text);
    var replaceSpecialChar = "";
    
    // Replace special characters in the sentence
    if(specialC.length > 0)
    {
        for(var w = 0; w < specialC.length; w++)
        {
            var pos = specialC[w].pos;
            var char = specialC[w].char;
            
            if(replaceSpecialChar.length > 0)
            	replaceSpecialChar = replaceSpecialChar.slice(0, pos) + char + replaceSpecialChar.slice(pos + 1, replaceSpecialChar.length);
            else
                replaceSpecialChar = newSentence.slice(0, pos) + char + newSentence.slice(pos + 1, newSentence.length);
        }
    }
    else replaceSpecialChar = newSentence;
    
    return replaceSpecialChar; 
};

/*
* Some tests that verify the integrity 
* of the program.
*/
var testCapitaliser = function ()
{
    assert(capitaliser("j'ai faim") == "J'Ai Faim");
    assert(capitaliser("il a 9 ans") == "Il A 9 Ans");
    assert(capitaliser("j'ai appris qu'ils sont morts!") == "J'Ai Appris Qu'Ils Sont Morts!");
    assert(capitaliser("il était une fois") == "Il Tait Une Fois");
    
    assert(JSON.stringify(specialChar("Non !")) == JSON.stringify([{pos: 4, char: "!"}]));
    
    assert(JSON.stringify(cutSentence("j'ai faim")) == JSON.stringify(["j", "ai", "faim"]));
    
    assert(isLetter("A") == true);
    assert(isLetter("'") == false);
    
    assert(isSpecialChar("'") == true);
    assert(isSpecialChar("A") == false);
};

testCapitaliser();

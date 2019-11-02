/*
* TP 1 - IFT1015
* Auteurs:
*   Mael LE PETIT (matricule),
*   PERSONNE 2 (matricule)
*
* // TODO : Description du programme
 */

let canvas = document.getElementById('canvas');

var grayScale = function(r, g, b)
{
    return  (0.2126 * r) + (0.7152 * g) + (0.0722 *  b);
};

function noirEtBlanc(imageOriginale)
{
    for(var y = 0; y < canvas.height; y++)
    {
        for(var x = 0; x < canvas.width; x++)
        {
            var value = grayScale(imageOriginale[y][x].r, imageOriginale[y][x].g ,imageOriginale[y][x].b);

            imageOriginale[y][x].r = value; // red
            imageOriginale[y][x].g = value; // green
            imageOriginale[y][x].b = value; // blue
        }
    }
    return imageOriginale;
}

/*
*  Function 'calculateBrightness'
*  c: Color value (red, green or blue)
*  q: Brightness value (< 1: darker, > 1: brighter)
*
*  return the value for a pixel
 */
function calculateBrightness(c, q)
{
    return (Math.pow((c/255), q) * 255);
}

function correctionClarte(imageOriginale, quantite)
{
    for(var y = 0; y < canvas.height; y++)
    {
        for(var x = 0; x < canvas.width; x++)
        {
            imageOriginale[y][x].r = calculateBrightness(imageOriginale[y][x].r, quantite); // red
            imageOriginale[y][x].g = calculateBrightness(imageOriginale[y][x].g, quantite); // green
            imageOriginale[y][x].b = calculateBrightness(imageOriginale[y][x].b, quantite); // blue
        }
    }
    return imageOriginale;
}

function hypotenuse(x1, y1, x2, y2)
{
    var xSquare = Math.pow(x1 - x2, 2);
    var ySquare = Math.pow(y1 - y2, 2);
    return Math.sqrt(xSquare + ySquare);
}

function matrice (row, column)
{
    let result = Array(row);
    for (let i = 0; i < row; i++)
        result[i] = Array(column);

    return result;
}

function flou (imageOriginale, taille)
{
    // Create (taille x taille) matrix & set each value at 1/N (N= taille pow 2)
    let v = (1/Math.pow(taille, 2));

    var center = Math.floor(taille/2); // m center position

    for (var y = 0; y < canvas.height; y++)
    {
        for (var x = 0; x < canvas.width; x++)
        {
            var red = v * imageOriginale[y][x].r;
            var green = v * imageOriginale[y][x].g;
            var blue = v * imageOriginale[y][x].b;

            let indexX = x - center,
                indexY = y - center,
                w = 0, // x of matrix
                z = 0; // y of matrix

            for(var a = indexY; a < (indexY + taille); a++)
            {
                for(var b = indexX; b < (indexX + taille); b++)
                {
                    if (b > 0 && b < canvas.width && a > 0 && a < canvas.height) // Out of bounds
                    {
                        red += v * imageOriginale[a][b].r;
                        green += v * imageOriginale[a][b].g;
                        blue += v * imageOriginale[a][b].b;
                    }
                    w++;
                }
                z++;
            }
            imageOriginale[y][x].r = red;
            imageOriginale[y][x].g = green;
            imageOriginale[y][x].b = blue;
        }
    }

    return imageOriginale;
}

function detectionContours(imageOriginale)
{
    // Define black & white to set the same value for r, g, b
    noirEtBlanc(imageOriginale);

    let verticalWeighting = [[-1, -2, -1],
                                [0, 0, 0],
                                [+1, +2, +1]],
        horizontalWeighting = [[-1, 0, +1],
                                [-2, 0, +2],
                                [-1, 0, +1]];

    for (var y = 0; y < canvas.height; y++)
    {
        for (var x = 0; x < canvas.width; x++)
        {
            var variaX = 0;
            var variaY = 0;

            var indexX = x - 1,
                indexY = y - 1,
                w = 0, // x of matrix 3 x 3
                z = 0; // y of matrix 3 x 3

            for(var a = indexY; a < (indexY + 3); a++)
            {
                for(var b = indexX; b < (indexX + 3); b++)
                {
                    if ((b > 0) && (b < canvas.width) && (a > 0) && (a < canvas.height)) // If it's out of bounds, do nothing
                    {
                        var pixelColor = imageOriginale[a][b].r; // Choose r but it's still the same for g, b

                        variaX += (horizontalWeighting[z][w] * pixelColor);
                        variaY += (verticalWeighting[z][w] * pixelColor);
                    }
                    w++;
                }
                z++;
            }

            var contourIntensity = Math.max(Math.abs(variaX), Math.abs(variaY));

            imageOriginale[y][x].r = contourIntensity;
            imageOriginale[y][x].g = contourIntensity;
            imageOriginale[y][x].b = contourIntensity;

        }
    }

    return imageOriginale;
}

function tests()
{
    /* TODO : Ajoutez des tests unitaires pour les 4 fonctions
       demandées et pour vos propres fonctions */
}

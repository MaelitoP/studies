/*
* TP 1 - IFT1015
* Auteurs:
*   Mael Le Petit (20143452),
*   Fannie Filion Bienvenue (20104125)
*
* Ce programme permet de modifier une image selon differents paramètres :
* la mettre en noir et blanc, augmenté ou réduire la clarté, appliquer un
* filtre "flou" et détecter les contours
*/

//Fonction pour la formule de la luminance
var nuanceGris = function(r, g, b) {
    return  (0.2126 * r) + (0.7152 * g) + (0.0722 *  b);
};

//Fonction qui met l'image en noir et blanc
function noirEtBlanc(imageOriginale) {
    let height = imageOriginale.length,
        width = imageOriginale[0].length;

    for (var y = 0; y < height; y++) {	//Iterer tous les pixels
        for (var x = 0; x < width; x++) {
            //Application de la fonction nuanceGris sur chacun des pixels
            var valeur = nuanceGris(imageOriginale[y][x].r, imageOriginale[y][x].g ,imageOriginale[y][x].b);
            imageOriginale[y][x].r = valeur;
            imageOriginale[y][x].g = valeur;
            imageOriginale[y][x].b = valeur;
        }
    }
    return imageOriginale;
}

//Fonction qui calcul l'eclat selon la couleur du pixel. Valeur de l'eclat : < 1 = foncé, > 1 = claire
function brightness(couleur, eclat) {
    return (Math.pow((couleur/255), eclat) * 255);
}

//Fonction qui augmente ou diminue la clarté de l'image
function correctionClarte(imageOriginale, quantite) {
    let height = imageOriginale.length,
        width = imageOriginale[0].length;

    for (var y = 0; y < height; y++) {	//Iterer tous les pixels
        for (var x = 0; x < width; x++) {
            //Application de la fonction brightness sur chacun des pixels
            imageOriginale[y][x].r = brightness(imageOriginale[y][x].r, quantite);
            imageOriginale[y][x].g = brightness(imageOriginale[y][x].g, quantite);
            imageOriginale[y][x].b = brightness(imageOriginale[y][x].b, quantite);
        }
    }
    return imageOriginale;
}

// Fonction qui applique un filtre "flou" a l'image
function flou (imageOriginale, taille) {
    let height = imageOriginale.length,
        width = imageOriginale[0].length;
    let imageRetourne = imageOriginale;
    let ponderation = (1/Math.pow(taille, 2)); // Valeur de la ponderation selon la taille

    let centre = Math.floor(taille/2); //Centre de la matrice

    for (let y = 0; y < height; y++) { // Iterer tous les pixels
        for (let x = 0; x < width; x++) {
            let red = ponderation * imageOriginale[y][x].r,
                green = ponderation * imageOriginale[y][x].g,
                blue = ponderation * imageOriginale[y][x].b;

            let indexX = x - centre,
                indexY = y - centre,
                verticale = 0; // y of matrix

            for(let a = indexY; a < (indexY + taille); a++) {
                let horizontale = 0; // x of matrix
                for(let b = indexX; b < (indexX + taille); b++) {
                    if (b > 0 && b < width && a > 0 && a < height) { // Depassement des bornes
                        red += ponderation * imageOriginale[a][b].r;
                        green += ponderation * imageOriginale[a][b].g;
                        blue += ponderation * imageOriginale[a][b].b;
                    }
                    horizontale++;
                }
                verticale++;
            }
            imageRetourne[y][x].r = red;
            imageRetourne[y][x].g = green;
            imageRetourne[y][x].b = blue;
        }
    }
    return imageRetourne;
}

// Fonction qui dessine les contours
function detectionContours(imageOriginale) {
    let height = imageOriginale.length,
        width = imageOriginale[0].length;
    // Mettre l'image en noir et blanc afin d'avoir la meme valeur pour les pixels r, g, b
    var image = noirEtBlanc(imageOriginale),
        imageRetourne = imageOriginale;

    // Ponderation verticale et horizontale des pixels de la matrice 3 x 3
    let ponderation_verticale = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]],
        ponderation_horizontale = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];

    for (var y = 0; y < height; y++) {	// Iterer tous les pixels
        for (var x = 0; x < width; x++) {
            var variationX = 0, variationY = 0,
                bound = 3;

            var verticale = 0;
            for(var a = y; a < (y + bound); a++) {	// Iterer les pixels de la matrice 3 x 3
                var horizontale = 0;
                for(var b = x; b < (x + bound); b++) {
                    if (a >= 0 && a < height && b >= 0 && b < width) {
                        var couleur = image[a][b].r; // Choix du canal rouge
                        variationX += (ponderation_horizontale[verticale][horizontale] * couleur);
                        variationY += (ponderation_verticale[verticale][horizontale] * couleur);
                    }
                    horizontale++;
                }
                verticale++;
            }
            // Intensite des contours
            var intensiteContour = Math.floor(Math.max(Math.abs(variationX), Math.abs(variationY)));

            if (intensiteContour > 255)
                intensiteContour = 255;

            imageRetourne[y][x].r = intensiteContour;
            imageRetourne[y][x].g = intensiteContour;
            imageRetourne[y][x].b = intensiteContour;
        }
    }
    return imageRetourne;
}


function hex_to_rgb (h) {
    let red = 0, green = 0, blue = 0;

    // 3 digits
    if (h.length === 4) {
        red = "0x" + h[1] + h[1];
        green = "0x" + h[2] + h[2];
        blue = "0x" + h[3] + h[3];

        // 6 digits
    } else if (h.length === 7) {
        red = "0x" + h[1] + h[2];
        green = "0x" + h[3] + h[4];
        blue = "0x" + h[5] + h[6];
    }
    return { r: +red, g: +green, b: +blue  };
}

function gradient(couleurA, couleurB) {
    var gradient = [];
    var maxValeur = 255;
    var de = hex_to_rgb(couleurA+"");
    var vers = hex_to_rgb(couleurB+"");

    for (var i = 0; i <= maxValeur; i++) {
        var intensiteB = i;
        var intensiteA = maxValeur - intensiteB;

        gradient[i] = {
            r: (intensiteA*vers.r + intensiteB*de.r) / maxValeur,
            g: (intensiteA*vers.g + intensiteB*de.g) / maxValeur,
            b: (intensiteA*vers.b + intensiteB*de.b) / maxValeur
        };
    }
    return gradient;
}

function rotationCouleurs (imageOriginale, couleurOriginal, couleur) {
    let height = imageOriginale.length,
        width = imageOriginale[0].length;

    var couleur_gradient = gradient(couleurOriginal, couleur);

    noirEtBlanc(imageOriginale);

    for (var y = 0; y < height; y++) {	//Iterer tous les pixels
        for (var x = 0; x < width; x++) {
            var redValue = imageOriginale[y][x].r;
            var greenValue = imageOriginale[y][x].g;
            var blueValue = imageOriginale[y][x].b;


            console.log(redValue);
            console.log(couleur_gradient[redValue]);
            imageOriginale[y][x].r = couleur_gradient[redValue].r;
            imageOriginale[y][x].g = couleur_gradient[greenValue].g;
            imageOriginale[y][x].b = couleur_gradient[blueValue].b;
        }
    }
    return imageOriginale;
}

function tests() {
    var imageTest  = [[{r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}],
        [{r: 0, g: 0, b: 0}, {r: 45, g: 35, b: 25}, {r: 0, g: 0, b: 0}],
        [{r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}]];

    // Check pour la fonction 'noirEtBlanc'
    console.assert(JSON.stringify(noirEtBlanc(imageTest)) === JSON.stringify([
        [{r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}],
        [{r: 0, g: 0, b: 0}, {r: 36.404, g: 36.404, b: 36.404}, {r: 0, g: 0, b: 0}],
        [{r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}]]));

    // Check pour la fonction 'correctionClarte'
    console.assert(JSON.stringify(correctionClarte(imageTest, 1.5)) === JSON.stringify([
        [{r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}],
        [{r: 0, g: 0, b: 0}, {r: Math.pow(3/17, 1.5) * 255,
            g: Math.pow(7/51, 1.5) * 255, b: Math.pow(5/51, 1.5) * 255}, {r: 0, g: 0, b: 0}],
        [{r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}]]));

    // Check pour la fonction 'flou'
    console.assert(JSON.stringify(flou(imageTest, 3)) === JSON.stringify([
        [{r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}],
        [{r: 0, g: 0, b: 0}, {r: 5, g: 35/9, b: 25/9}, {r: 0, g: 0, b: 0}],
        [{r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}]]));

    // Check pour la fonction 'detectionContours'
    console.assert(JSON.stringify(detectionContours(imageTest)) === JSON.stringify([
        [{r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}],
        [{r: 0, g: 0, b: 0}, {r: 36, g: 36, b: 36}, {r: 0, g: 0, b: 0}],
        [{r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}]]));

    console.assert(hex_to_rgb("#00FFFF") ===  { r: 0, g: 255, b: 255  });
    console.assert(brightness(35, 0.5) === (Math.pow((35/255), 0.5) * 255))
}

tests();

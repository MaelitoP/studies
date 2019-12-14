'use strict';

var http = require("http");
var fs = require('fs');
var urlParse = require('url').parse;
var pathParse = require('path').parse;
var querystring = require('querystring');
var crypto = require('crypto');
var request = require('sync-request');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

// Votre librairie est incluse ici
var markov = require('./markov.js');

// Fonctions exportées
var creerModele = markov.creerModele;
var genererParagraphes = markov.genererParagraphes;

// Liste de premières phrases possibles pour les articles
// Ajoutez-en si vous avez des idées!
var premieresPhrases = [
    "<strong>{{titre}}</strong> est un animal aquatique nocturne.",
    "<strong>{{titre}}</strong> (du grec ancien <em>\"{{titre-1}}\"</em> et <em>\"{{titre-2}}\"</em>), est le nom donné par Aristote à la vertu politique.",
    "<strong>{{titre}}</strong>, né le 30 août 1987 à Portland (Oregon), est un scénariste américain.",
    "<strong>{{titre}}</strong>, née le 30 septembre 1982 à Québec, est une femme politique québécoise.",
    "<strong>{{titre}}</strong> est défini comme « l'ensemble des règles imposées aux membres d'une société pour que leurs rapports sociaux échappent à l'arbitraire et à la violence des individus et soient conformes à l'éthique dominante ».",
    "<strong>{{titre}}</strong>, néologisme du XXe siècle, attesté en 1960, composite du grec ancien <em>{{titre-1}}</em> et du latin <em>{{titre-2}}</em>, est le principe déclencheur d'événements non liés à une cause connue.",
    "<strong>{{titre}}</strong> est une espèce fossile d'euryptérides ressemblant aux arachnides, appartenant à la famille des <em>{{titre-1}}</em>.",
    "<strong>{{titre}}</strong>, né le 25 juin 1805 à Lyon et mort le 12 février 1870 à Versailles, est un peintre animalier français.",
    "<strong>{{titre}}</strong> est le titre d'un épisode de la série télévisée d'animation Les Simpson. Il s'agit du quatre-vingt-dix-neuvième épisode de la soixante-huitième saison et du 8 615e épisode de la série.",
    "<strong>{{titre}}</strong>, composé de <em>{{titre-1}}</em>- et de -<em>{{titre-2}}</em>, consiste en l'étude d'une langue et de sa littérature à partir de documents écrits."
];

// --- Utilitaires ---
var readFile = function (path, binary) {
    if(!binary)
        return fs.readFileSync(path).toString('utf8');
    return fs.readFileSync(path, {encoding: 'binary'});
};

var writeFile = function (path, texte) {
    fs.writeFileSync(path, texte);
};

// ---------------------------------------------------------
//  Fonctions pour communiquer avec Wikipédia
//  (trouver des articles au hasard et extraire des images)
// ---------------------------------------------------------

/*
 * Requête *synchrone* pour obtenir du JSON depuis un API
 * quelconque.
 *
 * NOTEZ : ce code fait l'affaire pour ce TP, mais ne serait pas
 * acceptable dans un vrai serveur web. Pour simplifier le travail à
 * faire dans ce TP, on va néanmoins utiliser cette approximation, qui
 * serait beaucoup trop lente à exécuter sur un vrai site pour ne pas
 * que le site "laggue".
 */
var jsonRequestSync = function(url) {
    try {
        var response = request('GET', url);
    } catch(e) {
        return false;
    }

    if(response.statusCode != '200') {
        console.error(new Error("Page web invalide").stack);
        return false;
    }

    try {
        return JSON.parse(response.body.toString());
    } catch(e) {
        console.error(new Error("Page web invalide").stack);
    }
};

/*
 * Retourne un tableau contenant `n` titres de pages au hasard de
 * Wikipédia français
 */
var getRandomPageTitles = function(n) {
    var req = jsonRequestSync('https://fr.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=' + n + '&format=json');

    if(!req) {
        return Array(n).fill("Pas d'internet");
    }

    return req.query.random.map(function(x) {
        return x.title;
    });
};

var md5 = function(data) {
    return crypto.createHash('md5').update(data).digest("hex");
};

/*
 * Découpe le nom de fichier donné par Wikipédia pour l'image et
 * retourne son URL
 */
var fileUrl = function(wikipediaName) {
    var filename = wikipediaName.slice('Fichier:'.length).split(' ').join('_');

    var hash = md5(filename).slice(0, 2);

    return "https://upload.wikimedia.org/wikipedia/commons/" + hash[0] + '/' + hash + '/' + filename;
};

/*
 * Retourne l'URL de la première image de l'article Wikipédia dont le
 * titre est title.
 */
var getPageFirstImage = function(title) {
    var encodedTitle = encodeURIComponent(title);

    var pageUrl = "https://fr.wikipedia.org/w/api.php?action=query&titles=" +
                  encodedTitle + "&format=json&prop=images&imlimit=30";

    var req = jsonRequestSync(pageUrl);

    if(!req) {
        return undefined;
    }

    var pages = req.query.pages;

    if(typeof(pages[-1]) === "undefined") {
        var page = Object.values(pages)[0];

        if(typeof(page.images) === 'undefined') {
            return false;
        }

        var images = page.images.map(function(img) {
            return img.title;
        });

        images = images.filter(function(x) {
            var parts = x.split('.');
            return ['jpg', 'png', 'jpeg', 'gif'].indexOf(parts[parts.length - 1]) !== -1;
        });

        if(images.length > 0)
            return images[0];
    }

    return false;
};

/*
 * Retourne une image de Wikipédia Français pour l'article nommé
 * title. Si l'article existe, et comporte des images, cette fonction
 * retourne la première image de l'article (selon l'ordre retourné par
 * l'API de Wikipédia), sinon cette fonction trouve une image au
 * hasard.
 */
var getImage = function(title) {

    var img = false;
    var url;
    do {

        if(typeof(title) !== 'undefined') {
            // 1. Vérifier si la page Wikipédia de "title" existe
            img = getPageFirstImage(title);
        }

        if(!img) {
            do {
                // 2. Lister 10 articles au hasard de Wikipédia
                var randomPages = getRandomPageTitles(10);

                for(var i=0; i<randomPages.length; i++) {
                    img = getPageFirstImage(randomPages[i]);
                    if(img !== false) {
                        break;
                    }
                }
            } while(img === false);
        }

        if(img === undefined) {
            // Pas d'internet
            return '/no-internet.png';
        }

        url = fileUrl(img);

        title = undefined;
        img = false;

        try {
            var response = request('HEAD', url);

            // Image trop petite, on en trouve une autre
            if(response.headers['content-length'] < 30000) {
                response = false;
                continue;
            }
        } catch(e) {
            continue;
        }

    } while(!response || response.statusCode != '200');

    return url;
};

// --------------------
//  Gestion du serveur
// --------------------
var port = 1337;
var hostUrl = 'http://localhost:'+port+'/';
var defaultPage = '/index.html';

var mimes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
};

// --- Server handler ---
var redirect = function (reponse, path, query) {
    var newLocation = path + (query == null ? '' : '?' + query);
    reponse.writeHeader(302, {'Location' : newLocation });
    reponse.end('302 page déplacée');
};

var getDocument = function (url) {
    var pathname = url.pathname;
    var parsedPath = pathParse(url.pathname);
    var result = { data: null, status: 200, type: null };

    if(Object.keys(mimes).indexOf(parsedPath.ext) != -1) {
        result.type = mimes[parsedPath.ext];
    } else {
        result.type = 'text/plain';
    }

    try {
        if(['.png', '.jpg'].indexOf(parsedPath.ext) !== -1) {
            result.data = readFile('./public' + pathname, {encoding: 'binary'});
            result.encoding = 'binary';
        } else {
            result.data = readFile('./public' + pathname);
        }
        console.log('['+new Date().toLocaleString('iso') + "] GET " + url.path);
    } catch (e) {
        // File not found.
        console.log('['+new Date().toLocaleString('iso') + "] GET " +
                    url.path + ' not found');
        result.data = readFile('template/error404.html');
        result.type = 'text/html';
        result.status = 404;
    }

    return result;
};

var sendPage = function (reponse, page) {
    reponse.writeHeader(page.status, {'Content-Type' : page.type});
    reponse.end(page.data, page.encoding || 'utf8');
};

/**
* Function to know if it's a special characters
* @param char
* @return boolean
*/
let isSpecialChar = function (char)
{
    return ((char >= ":" && char <= "@") || (char >= "[" && char <= "`") || (char >= "{" && char <= "~"));
};

let substituerEtiquette = function (texte, etiquette, valeur)
{
    let replace = "";
    let updatedText = "";
    let specialChar = false;
    let arrayText = texte.split(" ");
    let count = 0;

    for(let j  = 0; j < etiquette.length; j++)
        if(etiquette[j] === "{")
            count++;

    if(count === 2)
        for(let i = 0; i < valeur.length; i++)
            if (isSpecialChar(valeur[i]))
            {
                specialChar = true;
                break;
            }

    if(specialChar)
        replace = entities.encode(valeur);
    else replace = valeur;

    arrayText.forEach(function (x) {
        if (x === etiquette)
            arrayText[arrayText.indexOf(x)] = replace;
        else if (x.includes(etiquette))
        {
            arrayText[arrayText.indexOf(x)] = x.replace(etiquette, replace);
        }
        else
            arrayText[arrayText.indexOf(x)] = x;
    });

    arrayText.forEach(element => {
        updatedText += element + " ";
    });

    return updatedText;
};

function removeBaliseHTML (string)
{

}

let getIndex = function ()
{
    let index = readFile(__dirname + "/template/index.html"); // Get index template
    let img = substituerEtiquette(index, "{{img}}", getImage());
    let articles = "";

    let randomTitles = getRandomPageTitles(20);
    randomTitles.forEach( function (x) {
        let titleTemplate = "<li><a href=\"{{url}}\">{{title}}</a></li>";
        randomTitles[randomTitles.indexOf(x)] = titleTemplate.replace("{{title}}", x).replace("{{url}}", "article/" + x);
    });

    randomTitles.forEach(element => {
        articles += element + "\n";
    });

    return substituerEtiquette(img, "{{{articles-recents}}}", articles);
};

function isNaturalNumber (n)
{
    n = n.toString();
    let n1 = Math.abs(n),
        n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
}

function randomize ()
{
    let random = Math.random();
    let chance = 15;
    return random < (chance * 100);
}

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

let getArticle = function(titre)
{
    let article = readFile(__dirname + "/template/article.html"); // Get article template
    article = substituerEtiquette(article, "{{titre}}", titre); // Insert article title
    article = substituerEtiquette(article, "{{img}}", getImage(titre)); // Insert article image

    let contenu = ""; // Article content
    let randomNbr = Math.floor(Math.random() * 6) + 1; // Random number between 1 & 10
    let firstSentence = premieresPhrases[randomNbr - 1];

    firstSentence = substituerEtiquette(firstSentence, "{{titre}}", titre);
    if(firstSentence.includes("{{titre-1}}") && firstSentence.includes("{{titre-2}}"))
    {
        let middle  = (titre.length / 2);
        if(!isNaturalNumber(middle))
            middle = Math.ceil(titre.length / 2) - 1;
        let title_2 = titre.slice(middle, titre.length),
            title_1 = titre.slice(0, middle);

        firstSentence = substituerEtiquette(firstSentence, "{{titre-1}}", title_1);
        firstSentence = substituerEtiquette(firstSentence, "{{titre-2}}", title_2);
    }

    firstSentence = "<p>" + firstSentence + "</p>";
    contenu += firstSentence; // Insert first sentence in the article

    let  wikipediaCorpus  = readFile(__dirname + "/corpus/exemple");
    let model = markov.creerModele(wikipediaCorpus);
    let paragraph = markov.genererParagraphes(model, 3, 6, 10);

    for (let i = 0; i < paragraph.length; i++)
    {
        let words = cutSentence(paragraph[i]);
        words.forEach(function (x) {
            if(x.length >= 7)
            {
                let save = "";
                if(randomize())
                {
                    let newWord = "<strong>" + x + "</strong>";
                    paragraph[i].replace(x, newWord);
                    save = newWord;
                }
                if(randomize())
                {
                    let newWord = "<em>" + x + "</em>";
                    paragraph[i].replace(save, newWord);
                    save = newWord;
                }
                if(randomize())
                {
                    let newWord = "<a href=\"/article/\"" + x +  ">" + x + "</a>";
                    paragraph[i].replace(save, newWord);
                }
            }
        });
        contenu += "<p>" + paragraph[i] + "</p><br/>";
    }
    article = substituerEtiquette(article, "{{{contenu}}}", contenu); // Insert article content
    return article;
};

/*
 * Création du serveur HTTP
 * Note : pas besoin de toucher au code ici (sauf peut-être si vous
 * faites les bonus)
 */
http.createServer(function (requete, reponse) {
    var url = urlParse(requete.url);

    // Redirect to index.html
    if (url.pathname == '/') {
        redirect(reponse, defaultPage);
        return;
    }

    var doc;

    if (url.pathname == defaultPage) {
        // Index
        doc = {status: 200, data: getIndex(), type: 'text/html'};
    } else if(url.pathname == '/random') {
        // Page au hasard
        redirect(reponse, '/article/' + encodeURIComponent(getRandomPageTitles(1)[0]));
        return;
    } else {
        var parsedPath = pathParse(url.pathname);

        if(parsedPath.dir == '/article') {
            var title;

            try {
                title = decodeURIComponent(parsedPath.base);
            } catch(e) {
                title = parsedPath.base.split('%20').join(' ');
            }

            // Force les articles à commencer avec une majuscule si c'est une lettre
            var capital = title.charAt(0).toUpperCase() + title.slice(1);
            if(capital != title) {
                redirect(reponse, encodeURIComponent(capital));
                return;
            }

            doc = {status: 200, data: getArticle(title), type: 'text/html'};
        } else {
            doc = getDocument(url);
        }
    }
    sendPage(reponse, doc);
}).listen(port);

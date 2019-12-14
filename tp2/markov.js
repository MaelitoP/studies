/*  Programme réaliser par Fannie Filion Bienvenue (20104125)
    et Mael Le Petit (xxxx xxxx) dans le cadre du TP 2 du
    cours IFT-1015. Ce programme permet de générer un mot,
    des phrases ou des paragraphes selon un modèle de markov
 */

// Utilitaires pour manipuler des fichiers
var fs = require("fs");

var readFile = function (path) {
    return fs.readFileSync(path).toString();
};

var writeFile = function (path, texte) {
    fs.writeFileSync(path, texte);
};

var liste = function(mot) {

}

var creerModele = function (texte) {

    // Declaration des variables
    var temp = [],
        temp2 = [],
        temp3 = [],
        prob = [],
        total = [],
        suite = [],
        suivants = [],
        duplicate = [],
        repetition = [];

    var modele = {
        dictionnaire: [""],
        prochainsMots: []
    };

    // Separation du texte en mots
    var mots = texte.split(/[ +\n]/);
    mots.unshift("");

    for (var x=0; x<mots.length; x++) {
        var last = mots[x].length-1;
        if (mots[x].charAt(last) == '.') {
            mots.splice(x+1, 0, '')
        }
    }

    // Créer un dictionnaire temporaire
    for (var i = 0; i <= mots.length - 1; i++) {
        temp.push(mots[i])
    }

    // Retourner un nouveau dictionnaire sans duplicat
    for (var j = 0; j <= mots.length - 1; j++) {
        if (modele.dictionnaire.indexOf(temp[j]) === -1) {
            modele.dictionnaire.push(temp[j]);
        }
    }

    // Occurence de chaque mot dans le texte
    for (var l = 0; l < (modele.dictionnaire).length; l++) {
        var mm_mot = 0;
        for (var m = 0; m < mots.length; m++) {
            if (modele.dictionnaire[l] === mots[m]) {
                mm_mot += 1
            }
        }
        total.push([modele.dictionnaire[l], mm_mot])
    }

    // Chaque mot et son suivant
    for (var w = 0; w < mots.length; w++) {
        if (w+1 == mots.length) break;
        duplicate.push([mots[w], mots[w+1]])
    }

    // Nombre de fois qu'un certain mot apparait après un autre
    temp2 = duplicate;
    for (var a=0; a<temp2.length; a++) {
        var compteur = 1;
        for (var b=a+1; b<temp2.length; b++) {
            if (JSON.stringify(temp2[a]) == JSON.stringify(temp2[b])) {
                compteur += 1;
                temp2.splice(b, 1)
            }
        }
        repetition.push([temp2[a], compteur])
    }

    // Probabilité qu'un certain mot apparaisse apres un autre
    for (var c=0; c<repetition.length; c++) {
        for (var d=0; d<total.length; d++) {
            if (repetition[c][0][0] == total[d][0]) {
                prob.push([repetition[c][0][1], ((repetition[c][1])*(1/total[d][1])).toFixed(2)])
            }
        }
    }

    // Tous les mots suivant un certain mot
    for (var f=0; f<(modele.dictionnaire).length; f++) {
        var suivant = [];
        for (var g=0; g<repetition.length; g++) {
            if (JSON.stringify(modele.dictionnaire[f]) == JSON.stringify(repetition[g][0][0])) {
                suivant.push(repetition[g][0][1])
            }
        }
        suivants.push(suivant)
    }

    // Tableau "suivant" sous forme de liste (pour indexer)
    for (var p=0; p<suivants.length; p++) {
        for (var q=0; q<(suivants[p]).length; q++) {
            suite.push(suivants[p][q])
        }
    }

    // Triage des probabilite dans l'ordre du tableau "suite"
    for (var v=0; v<suite.length; v++) {
        for (var t=0; t<prob.length; t++) {
            if (suite[v] == prob[t][0]) {
                temp3.push(prob[t][1]);
                prob.splice(t, 1);
                break
            }
        }
    }

    // Consolidation du tableau temp3
    var temp5 = [];
    for (var y=0; y<suivants.length; y++) {
        var temp4 = [];
        for (var r=0; r<suivants[y].length; r++) {
            temp4.push(temp3[r])
        }
        temp3.splice(0, r);
        temp5.push(temp4)
    }

    // Tableau final
    for (var e=0; e<(modele.dictionnaire).length; e++) {
        var resultat = [];
        for (var h=0; h<suivants.length; h++) {
            var partiel = [];
            for (var s=0; s<(suivants[h]).length; s++) {
                var liste = new Object();
                liste.mot = suivants[h][s];
                liste.prob = temp5[h][s];
                partiel.push(liste)
            }
            resultat.push(partiel)
        }
    }

    for (var z=0; z<resultat.length-1; z++) {
        modele.prochainsMots.push(resultat[z])
    }
    return modele;
};

var genererProchainMot = function(modele, motActuel) {

    // Declaration de variables
    var max = -1000;
    var temp = [];
    temp.push(motActuel);

    // Mot suivant motActuel
    for (var i=0; i<(modele.prochainsMots).length; i++) {
        for (var j=0; j<(modele.prochainsMots[i]).length; j++) {
            if (motActuel == (modele['prochainsMots'][i][j]).mot) {
                for (var k=0; k<(modele['prochainsMots'][i+1]).length; k++) {
                    if ((modele['prochainsMots'][i+1][k]).prob > max) {
                        max = (modele['prochainsMots'][i+1][k]).prob;
                        var prochainMot = (modele['prochainsMots'][i+1][k].mot);
                    }
                }
                temp.push(prochainMot)
            }
        }
    }
    return temp.join(' ')
};

var genererPhrase = function(modele, maxNbMots) {

    // Declaration de variables
    var compteur = 1,
        temp = [],
        max1 = 0;

    // Premier mot de la phrase
    for (var a=0; a<(modele.prochainsMots[0]).length; a++) {
        var rand = Math.floor(Math.random() * (modele.prochainsMots[0]).length);
        var premier = (modele['prochainsMots'][0][rand].mot);
    }
    temp.push(premier);
    var motActuel = premier;

    // Mots suivants
    boucle: while (compteur != maxNbMots && motActuel.charAt(motActuel.length-1) != '.') {
        for (var i=0; i<(modele.prochainsMots).length; i++) {
            var max2 = 0;
            for (var j=0; j<(modele.prochainsMots[i]).length; j++) {
                if (motActuel == (modele['prochainsMots'][i][j]).mot) {
                    for (var k=0; k<(modele['prochainsMots'][i+1]).length; k++) {
                        var rand2 = Math.floor(Math.random() * (modele.prochainsMots[i+1]).length);
                        var prochainMot = (modele['prochainsMots'][i+1][rand2].mot);
                    }
                    temp.push(prochainMot);
                    motActuel = prochainMot;
                    compteur++;
                    continue boucle;
                }
            }
        }
    }
    return temp.join(' ')
};

var genererParagraphes = function(modele, nbParagraphes, maxNbPhrases, maxNbMots) {

    // Declaration de variables
    var compteur = 0,
        paragraphe = "",
        temp = [],
        result = [];

    while (compteur != nbParagraphes) {
        var rand = Math.floor(Math.random() * (maxNbPhrases)+1),
            compteur2 = 0,
            phrase = [];
        while (compteur2 != rand) {
            phrase.push(genererPhrase(modele, maxNbMots));
            compteur2++;
        }
        paragraphe += (phrase.join('\n'));
        result.push(paragraphe);
        paragraphe = "";
        compteur++;
    }
    return result;
};

var tests = function() {
    /* Les tests seront lancés automatiquement si vous appelez ce
    fichier avec :
       node markov.js
     */

    // Utilisez console.assert(a == b); pour faire des tests unitaires
    // console.log('TODO : exécuter des tests');
};

if (require.main === module) {
    // Si on se trouve ici, alors le fichier est exécuté via : nodejs markov.js
    tests(); // On lance les tests
} else {
    /* Sinon, le fichier est inclus depuis index.js
       On exporte les fonctions importantes pour le serveur web */
    exports.creerModele = creerModele;
    exports.genererParagraphes = genererParagraphes;
}

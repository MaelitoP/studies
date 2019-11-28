/**
 * File: pass.js
 * @author Maël LE PETIT (IFT1015)
 * @version  1.0
 *
 * This program takes the user's password as input. Then, he checks
 * if the password meets certain safety criteria before requesting
 * a password confirmation.
*/

let mdp = document.getElementById("mdp"); // Get mdp input
let confirm = document.getElementById("confirmation"); // Get confirmation input

/**
 * Called by validation button.
 */
function eventClick ()
{
    console.log("Validation du mot de passe..");
    check(mdp.value, confirm.value); // Check mdp
}

/**
 * Print a text above the validation button.
 * @param text
 */
function sendAlert (text)
{
    let html = document.getElementById("message");
    html.innerText = text;
    html.style.fontWeight = "bold";
}

/**
 * Check if the password meets certain conditions
 * and validate if it corresponds to the confirmation.
 * @param password
 * @param confirmation
 */
function check (password, confirmation)
{
    let size = password.length;

    // Check conditions
    if (!(size >= 5 && size <= 10) || password[0] === password[size - 1] || !((/[0-9]/.test(password))
        && (/[a-z]/.test(password)) && (/[A-Z]/.test(password))))
    {
        confirm.style.backgroundColor = "white";
        mdp.style.backgroundColor = "red";
        sendAlert("Mot de passe invalide");
    }
    else if (confirmation !== password) // Check equality between two inputs
    {
        mdp.style.backgroundColor = "white";
        confirm.style.backgroundColor = "red";
        sendAlert("Les deux champs ne concordent pas");
    }
    else // Validation
    {
        mdp.style.backgroundColor = "white";
        confirm.style.backgroundColor = "white";
        sendAlert("Mot de passe enregistré!");
    }
}
// End

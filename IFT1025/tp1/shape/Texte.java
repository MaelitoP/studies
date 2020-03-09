package fr.shape;

public class Texte extends Forme
{
    protected char[] tabLettres;
    protected int[] diffLettres;
    protected String text;


    public Texte(int x, int y, String texte)
    {

        super(x, y,8*texte.length(),12);

        this.tabLettres = new char[texte.length()];
        this.diffLettres = new int[texte.length()];
        this.text = texte;
        this.init();
    }

    @Override
    public void init()
    {
        for(int i = 0; i < this.text.length(); i++){
            this.tabLettres[i] = this.text.charAt(i);

            // lettre 1 ce sera 0, lettre 2 12 ...
            this.diffLettres[i] = i*8;
        }

        for(int i = 0; i < this.tabLettres.length; i++){

            Caractere lettre = new Caractere(i*8, 0, this.tabLettres[i]);

            for(int j = 0; j < this.getxLength(); j++){
                for(int k = 0; k < 8; k++){

                    (super.getShape())[j][k + this.diffLettres[i]] =
                            (lettre.getShape())[j][k];

                }
            }
        }

        // pcq dans lexemple ils font comme si que la premiere colonne
        // commencait a 0, mais dans lettre la premiere colonne de texte commence
        // a 1
        this.setDiffX(1);
    }
}

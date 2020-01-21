package fr.maelito;

public class Matrice
{
    private int cols, rows;
    private double[][] matrix;

    /**
     * Constructeur pour une matrice de taille Nlignes x Mcolonnes
     * remplie de zéros
     * @param lignes
     * @param cols
     */
    public Matrice(int lignes, int cols)
    {
        this.rows = lignes;
        this.cols = cols;
        this.matrix = new double[lignes][cols];

        init();
    }

    public void init()
    {
        for(int i = 0; i < this.rows; i ++)
            for(int j = 0; j < this.cols; j++)
                this.matrix[i][j] = 0;
    }

    public int getRows()
    {
        return this.rows;
    }

    public int getCols()
    {
        return this.cols;
    }

    /**
     * Additionne la valeur n dans toutes les cellules de la matrice
     * @param n
     */
    public void additionnerScalaire(double n)
    {
        for(int i = 0; i < this.rows; i ++)
            for(int j = 0; j < this.cols; j++)
                this.matrix[i][j] += n;
    }

    /**
     * Multiplie toutes les cellules par un scalaire
     * (modifie la matrice actuelle)
     * @param n
     */
    public void multiplierScalaire(double n)
    {
        for(int i = 0; i < this.rows; i ++)
            for(int j = 0; j < this.cols; j++)
                this.matrix[i][j] *= n;
    }

    /**
     * Fait le produit matriciel entre deux matrices
     * @param m
     * @return
     */
    public Matrice dotProduct(Matrice m)
    {
        if(this.cols != m.getRows())
        {
            System.err.println("Erreur dans les dimensions des matrices");
            return null;
        }

        Matrice newMatrix = new Matrice(this.rows, m.getCols());

        for(int i = 0; i < newMatrix.getRows(); i ++)
            for(int j = 0; j < newMatrix.getCols(); j++)
                for(int k = 0; k < this.cols; k++)
                    newMatrix.setCell(i, j, (newMatrix.getCell(i, j) + (this.matrix[i][k] * m.getCell(k, j))));


        return newMatrix;
    }

    /**
     * Accesseur pour la cellule à une ligne/colonne donnée
     * @param ligne
     * @param col
     * @return
     */
    public double getCell(int ligne, int col)
    {
        return this.matrix[ligne][col];
    }

    /**
     * Mutateur pour la cellule à une ligne/colonne donnée
     * @param ligne
     * @param col
     * @param valeur
     */
    public void setCell(int ligne, int col, double valeur)
    {
        this.matrix[ligne][col] = valeur;
    }

    /**
     * Retourne un nouveau vecteur contenant la Nième ligne
     * @param ligne
     * @return new Vector of line value
     */
    public Vecteur getLine(int ligne)
    {
        double[] vector = new double[this.cols];
        for(int i = 0; i < vector.length; i++)
            vector[i] = this.matrix[ligne][i];

        return new Vecteur(vector);
    }

    /**
     * Retourne un nouveau vecteur contenant la Nième colonne
     * @param col
     * @return
     */
    public Vecteur getCol(int col)
    {
        double[] vector = new double[this.rows];
        for(int i = 0; i < this.rows; i++)
            vector[i] = this.matrix[i][col];

        return new Vecteur(vector);
    }

    /**
     *  Affiche la matrice sur la console, chaque ligne entre crochets [ ]
     */
    public void afficher()
    {
        StringBuilder string = new StringBuilder();

        for(int i = 0; i < this.rows; i ++)
        {
            string.append("[");
            for (int j = 0; j < this.cols; j++)
            {
                string.append(this.matrix[i][j]);
                if(j < this.cols - 1)
                    string.append(", ");
            }
            string.append("]\n");
        }

        System.out.println(string.toString());
    }

    /**
     * Retourne une version transposée de la matrice
     * @return
     */
    public Matrice transpose()
    {
        Matrice trans = new Matrice(this.cols, this.rows);

        for(int i = 0; i < this.rows; i ++)
            for(int j = 0; j < this.cols; j++)
                trans.setCell(j, i, this.matrix[i][j]);
        return trans;
    }

    /**
     * Retourne une instance de la matrice identité N x N
     * @param n
     * @return
     */
    public static Matrice identite(int n)
    {
        Matrice identity = new Matrice(n, n);

        for(int i = 0; i < n; i++)
            identity.setCell(i, i, 1);
        return identity;
    }
}

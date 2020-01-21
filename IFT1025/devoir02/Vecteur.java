package fr.maelito;

public class Vecteur
{
    private int size;
    private double[] vector;

    public Vecteur(double[] elements)
    {
        this.vector = elements;
        this.size = elements.length;
    }

    /**
     * Permet de changer la valeur à l'index donné
     * @param index
     * @param valeur
     */
    public void setElement(int index, double valeur)
    {
        this.vector[index] = valeur;
    }

    public int getSize()
    {
        return this.size;
    }

    /**
     * Retourne la valeur à l'index demandé
     *
     * @param index
     * @return value
     */
    public double getElement(int index)
    {
        return this.vector[index];
    }

    /**
     * Calcule le produit scalaire avec un autre vecteur
     * @param v
     * @return result
     */
    public double dotProduct(Vecteur v)
    {
        double result = 0.0;

        if(this.size != v.getSize())
        {
            System.err.println("Erreur dans les dimensions des vecteurs.");
            return Double.NaN;
        }

        for(int i = 0; i < this.size; i++)
            result += this.vector[i] * v.vector[i];
        return result;
    }

    /**
     * Affiche le contenu du vecteur entres accolades sur la console
     */
    public void afficher()
    {
        StringBuilder s = new StringBuilder();
        s.append("{");
        for(int i = 0; i < this.size; i++)
        {
            s.append(this.vector[i]);
            if(i < this.size - 1)
                s.append(", ");
        }
        s.append("}");
        System.out.println(s.toString());
    }
}

package main;

import java.util.Scanner;

public class Exercice1
{
    /**
     * Cette fonction prend un tableau de Strings en paramètre et retourne un
     * nouveau tableau contenant les mêmes éléments, avec une case disponible de
     * plus.
     *
     * @param tab (String array)
     * @return String[]
     */
    public static String[] agrandirTab(String[] tab)
    {
        int tabSize = tab.length;
        int newSize = tabSize + 1;
        String[] newArray = new String[newSize];

        for(int i = 0; i < tab.length; i++)
            newArray[i] = tab[i];

        return newArray;
    }

    /**
     * Cette fonction lit des mots sur la ligne de commande et les retourne dans
     * un tableau de Strings. Chaque "mot" est définit comme une ligne complète,
     * du début de la ligne entrée jusqu'au prochain \n.
     *
     * @return String[]
     */
    public static String[] lireMots()
    {
        Scanner in = new Scanner(System.in);
        String word;
        int count = 0;
        String[] wordsArray = new String[0];

        while(in.hasNextLine() && !((word = in.nextLine()).equals("stop")))
        {
            if(!word.equals("stop"))
            {
                wordsArray = agrandirTab(wordsArray);
                wordsArray[count] = word;
                count++;
            }
        }
        return wordsArray;
    }

    /**
     * Cette fonction prend en paramètre un tableau de mots et retourne un
     * nouveau tableau contenant ces mots triés en ordre croissant.
     *
     * @param mots (String array)
     * @return String[]
     */
    public static String[] trier(String[] mots)
    {
        for (int i = 0; i < mots.length - 1; i++)
        {
            for (int j = 0; j < (mots.length - i - 1); j++)
            {
                if (mots[j].compareTo(mots[j + 1]) > 0)
                {
                    String temp = mots[j];
                    mots[j] = mots[j + 1];
                    mots[j + 1] = temp;
                }
            }
        }
        return mots;
    }

    /**
     * Cette fonction prend en paramètre un tableau de mots trié et retourne un
     * nouveau tableau où chaque mot est unique (tous les doublons sont
     * retirés).
     *
     * @param mots (String array)
     * @return String[]
     */
    public static String[] retirerDoublons(String[] mots)
    {
        String[] sansDoublous = new String[0];
        int size = mots.length;
        int count = 0;

        // Check & replace duplicate words by null value
        for(int s = 0; s < size - 1; s++)
            for(int m = s + 1; m < size; m++)
                if(mots[s] != null && mots[s].equals(mots[m]))
                    mots[m] = null;

        // Insert words in a new array without duplicated values
        for(int i = 0; i < size; i++)
        {
            if(mots[i] != null)
            {
                sansDoublous = agrandirTab(sansDoublous);
                sansDoublous[count] = mots[i];
                count++;
            }
        }
        return sansDoublous;
    }

    /**
     * Main function
     * @param args
     */
    public static void main(String[] args)
    {
        String[] wordsEntry = lireMots();
        String[] sortedWords = trier(wordsEntry);
        String[] removeDuplicateWord = retirerDoublons(sortedWords);
        for(int a = 0; a < removeDuplicateWord.length; a++)
            System.out.println(removeDuplicateWord[a]);
    }
}

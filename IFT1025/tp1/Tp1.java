package fr;

import fr.shape.*;

import java.util.Random;
import java.util.Scanner;

public class Tp1
{
    public static Surface myDraw;
    public static char currentChar = '\u0000';

    public static void initCommand(String[] args)
    {
        switch (args[0])
        {
            // ADD COMMAND
            case "ajouter":
                if(myDraw == null)
                {
                    print("ERREUR: Aucune surface définie");
                    break;
                }

                if(args.length == 5)
                {
                    if(!(isInteger(args[2]) && isInteger(args[3])))
                        print("Erreur d'argument! 'x0 y0 rayon' doivent êtres des entiers positifs.");
                    else
                    {
                        switch (args[1])
                        {
                            case "cercle":
                                Cercle sCircle = new Cercle(Integer.parseInt(args[2]), Integer.parseInt(args[3]), Integer.parseInt(args[4]));
                                if(!(currentChar == '\u0000'))
                                {
                                    sCircle.setChar(currentChar);
                                    currentChar = '\u0000';
                                }
                                sCircle.add();
                                break;

                            case "carre":
                                Carre sSquare = new Carre(Integer.parseInt(args[2]), Integer.parseInt(args[3]), Integer.parseInt(args[4]));
                                if(!(currentChar == '\u0000'))
                                {
                                    sSquare.setChar(currentChar);
                                    currentChar = '\u0000';
                                }
                                sSquare.add();
                                break;

                            case "caractere":
                                Caractere sChar = new Caractere(Integer.parseInt(args[2]), Integer.parseInt(args[3]), args[4].charAt(0));
                                if(!(currentChar == '\u0000'))
                                {
                                    sChar.setChar(currentChar);
                                    currentChar = '\u0000';
                                }
                                //sChar.add();
                                print(sChar.toString());
                                break;

                            case "texte":
                                Texte sText = new Texte(Integer.parseInt(args[2]), Integer.parseInt(args[3]), args[4]);
                                if(!(currentChar == '\u0000'))
                                {
                                    sText.setChar(currentChar);
                                    currentChar = '\u0000';
                                }
                                print(sText.toString());
                                //sText.add();
                                break;

                            default:
                                print("Erreur! Forme disponible: 'rectangle, carre, ligne, cercle, caractere, texte'.");
                                break;
                        }
                    }
                }
                else if(args.length == 6)
                {
                    if(!(isInteger(args[2]) && isInteger(args[3]) && isInteger(args[4]) && isInteger(args[5])))
                            print("Erreur d'argument! 'x0 y0 xLength yLength' doivent êtres des entiers positifs.");
                        else
                        {
                            switch (args[1])
                            {
                                case "rectangle":
                                    Rectangle sRectangle = new Rectangle(Integer.parseInt(args[2]), Integer.parseInt(args[3]), Integer.parseInt(args[4]), Integer.parseInt(args[5]));
                                    if(!(currentChar == '\u0000'))
                                    {
                                        sRectangle.setChar(currentChar);
                                        currentChar = '\u0000';
                                    }
                                    sRectangle.add();
                                    break;

                                case "ligne":
                                    Ligne sLine = new Ligne(Integer.parseInt(args[2]), Integer.parseInt(args[3]), Integer.parseInt(args[4]), Integer.parseInt(args[5]));
                                    if(!(currentChar == '\u0000'))
                                    {
                                        sLine.setChar(currentChar);
                                        currentChar = '\u0000';
                                    }
                                    print(sLine.toString());
                                    sLine.add();
                                    break;

                                default:
                                    print("Erreur! Forme disponible: 'rectangle, carre, ligne, cercle, caractere, texte'.");
                                    break;
                            }
                        }

                }
                else
                    print("Erreur d'argument! Type: 'ajouter FORME x0 y0 xLength yLength'.");
                break;

            // CHARACTER COMMAND
            case "car":
                if(args.length != 2 || args[1].length() > 1)
                    print("Erreur d'argument! Type: 'car CARACTERE'.");
                else
                    currentChar = args[1].charAt(0);
                break;

            // INIT COMMAND
            case "init":
                if(args.length != 3 || !(isInteger(args[1]) && isInteger(args[2])))
                    print("Erreur d'argument! Type: 'init LARGEUR HAUTEUR'.");
                else
                    myDraw = new Surface(Integer.parseInt(args[1]), Integer.parseInt(args[2]));
                break;

            // DRAW COMMAND
            case "dessiner":
                myDraw.print();
                break;

            case "renverser":
                myDraw.renverser();
                break;

            case "brasser":
                myDraw.brasser();
                break;

            default:
                print("Erreur! Commande inconnue.");
                break;
        }
    }

    public static void main(String[] args)
    {
        Scanner in = new Scanner(System.in);

        while(in.hasNextLine())
        {
            String commandLine = in.nextLine();
            String commandArgs[] = commandLine.split(" ");

            initCommand(commandArgs);
            if(commandLine.equals("fin")) break;
        }
    }

    public static void print(String s)
    {
        System.out.println(s);
    }

    public static Surface getDraw()
    {
        return myDraw;
    }

    public static boolean isInteger(String s)
    {
        try {
            Integer.parseInt(s);
        } catch(NumberFormatException e) {
            return false;
        } catch(NullPointerException e) {
            return false;
        }
        return true;
    }
}

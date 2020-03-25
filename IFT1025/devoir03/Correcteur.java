package fr.maelito;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;
import java.util.regex.Pattern;

/**
 * Spellchecker program for IFT1025
 * @version 0.1
 * @author Maël LE PETIT
 */
public class Main
{
    static HashSet<String> dictionary  = new HashSet<>();
    static HashMap<String, Set<String>> wordsSet = new HashMap<>();
    static String fileName;

    public static void main(String[] args)
    {
        if (args.length != 2) {
            System.out.println("Attention: 2 arguments sont attendus");
            System.exit(-1);
        }

        fileName = args[0];
        init(args[1]);
        check();
    }

    /**
     * Init the dictionary file & words set of potential typing error.
     * @param dict file name of dictionary
     */
    public static void init(String dict)
    {
        // Init the dictionary
        try {
            FileReader fileReader = new FileReader(dict);
            BufferedReader br = new BufferedReader(fileReader);

            String line;

            while((line = br.readLine()) != null) {
                dictionary.add(line);
            }

            br.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Setup potential typing error of word (from dictionary)
        for(String key : dictionary)
        {
            Set<String> values = new HashSet<>();
            StringBuilder word;
            int w = 0;

            while(w < key.length())
            {
                word = new StringBuilder();
                for(int i = 0; i < key.length(); i++)
                    if(w != i) word.append(key.charAt(i));
                values.add(word.toString());
                w++;
            }
            wordsSet.put(key, values);
        }
    }

    /**
     * Verify if a word is correct in the text & replace
     * by suggestions of potentially correct word if isn't.
     */
    public static void check()
    {
        StringBuilder text = new StringBuilder();
        Pattern wordPattern = Pattern.compile("[a-zA-Z\\u00C0-\\u017F]+");
        Pattern patternSeparateur = Pattern.compile("[^a-zA-Z\\u00C0-\\u017F]+");

        try {
            FileReader fileReader = new FileReader(fileName);
            Scanner s = new Scanner(fileReader);
            s.useDelimiter("\\b");

            while (s.hasNext(wordPattern)) {
                // Word
                String word = s.next(wordPattern);
                if(dictionary.contains(word)) text.append(word);
                else
                {
                    String correctedWord = "[" + word + " => {correction}]"; // Correction pattern
                    correctedWord.replace("{correction}", find(word));
                    text.append(correctedWord);
                }

                // Separator
                String sep = s.next(patternSeparateur);
                text.append(sep);
            }

            s.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     *
     * @param incorrectWord
     * @return string with all possibilities for the correct word
     */
    public static String find(String incorrectWord)
    {
        String correction = "";
        List<String> corrections = new ArrayList<>();

        //TODO find the correct word to repelace
        if(wordsSet.values().stream().anyMatch(list -> list.contains(incorrectWord)))
        {
            for (String key : wordsSet.keySet()) {
                for (String listItem : wordsSet.get(key)) {
                    if (incorrectWord.equalsIgnoreCase(listItem)) {
                        corrections.add(key);
                    }
                }
            }
        }

        for(int i = 0; i < corrections.size(); i++)
        {
            if(corrections.size() == 0) correction = "(?)";
            if(i == corrections.size()-1) correction += corrections.get(i);
            else correction += corrections.get(i) + ",";
        }

        return correction;
    }
}

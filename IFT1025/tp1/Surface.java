import fr.shape.Forme;

import java.util.ArrayList;
import java.util.List;

public class Surface
{
    private int x, y;
    private char[][] myDraw;

    public Surface(int x, int y)
    {
        this.x = x;
        this.y = y;
        this.myDraw = new char[this.y][this.x];

        for(int v = 0; v < this.y; v++)
            for(int w = 0; w < this.x; w++)
                this.myDraw[v][w] = '\u0000';
    }

    public void add(Forme s) // Ajouter une forme sur la surface du dessin
    {
        char[][] arr = s.getShape();
        int v = 0, w = 0;
        int x0 = s.getX0() - s.getDiff();
        int y0 = s.getY0() - s.getDiff();

        for(int i = 0; i < s.getyLength(); i++)
        {
            for(int j = 0; j < s.getxLength(); j++)
            {
                if(arr[v][w] != '\u0000'){
                    this.myDraw[i+y0][j+x0] = s.getChar();

                }
                w++;
                if(w == s.getxLength()) w = 0;
            }
            v++;
            if(v == s.getyLength()) v = 0;
        }
    }

    public void brasser()
    {
        List<Forme> list = new ArrayList<>();

        //Erase current draw
        for(int v = 0; v < this.y; v++)
            for(int w = 0; w < this.x; w++)
                this.myDraw[v][w] = '\u0000';

        //  Add new draw
        for(Forme f : Forme.list)
        {
            int nbrAxes = (int)(Math.random() * ((1 - 3) + 1)) + 3;

            switch (nbrAxes)
            {
                case 1: // X
                    f.setX0(f.getX0() + getRandomOne());
                    break;
                case 2: // Y
                    f.setY0(f.getY0() + getRandomOne());
                    break;
                case 3: // X & Y
                    f.setX0(f.getX0() + getRandomOne());
                    f.setY0(f.getY0() + getRandomOne());
                    break;
            }
            this.add(f);
            list.add(f);
        }
        Forme.list = list;
    }

    private int getRandomOne()
    {
        int i = (int) (Math.random() * ((1 - 2) + 1)) + 2;
        return i == 2 ? 1 : -1;
    }


    public void renverser()
    {}

    public void print()
    {
        StringBuilder sb = new StringBuilder();
        for(int v = 0; v < this.y; v++)
        {
            for(int w = 0; w < this.x; w++)
            {
                if(this.myDraw[v][w] == '\u0000')
                    sb.append(" ");
                else
                    sb.append(this.myDraw[v][w]);
            }
            sb.append("\n");
        }
        System.out.println(sb.toString());
    }
}

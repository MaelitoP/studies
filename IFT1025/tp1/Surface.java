package fr;

import fr.shape.Forme;

import java.util.*;

public class Surface
{
    private int x, y;
    private char[][] myDraw;
    private Set<Forme> list = new HashSet<Forme>();

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
                    if(((i+y0) < this.y) && ((j+x0) < this.x))
                        this.myDraw[i+y0][j+x0] = s.getChar();

                }
                w++;
                if(w == s.getxLength()) w = 0;
            }
            v++;
            if(v == s.getyLength()) v = 0;
        }
        this.list.add(s);
    }

    public void brasser()
    {
        Set<Forme> list1 = this.list;
        this.list = new HashSet<>();
        this.erase(); //Erase current draw

        //  Add new draw
        for(Forme f : list1)
        {
            Random r = new Random();
            int nbrAxes = r.nextInt(3-1) + 1;
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
        }
    }

    private int getRandomOne()
    {
        int i = (int) (Math.random() * ((1 - 2) + 1)) + 2;
        return i == 2 ? 1 : -1;
    }

    public void renverser()
    {
        int y0, y1;
        Set<Forme> list1 = this.list;
        this.list = new HashSet<>();

        this.erase(); //Erase current draw
        for(Forme f : list1)
        {
            if(f.isReverse())
            {
                y0 = f.getY0()-(f.getY1()/2);
                y1 = f.getY1()/2;
                f.setY0(y0);
                f.setY1(y1);
                f.setReverse(false);
            }
            else
            {
                y0 = f.getY0()+f.getY1();
                y1 = f.getY1()*2;
                f.setY0(y0);
                f.setY1(y1);
                f.setReverse(true);
            }

            f.init();
            this.add(f);
        }
    }

    public void erase()
    {
        for(int v = 0; v < this.y; v++)
            for(int w = 0; w < this.x; w++)
                this.myDraw[v][w] = '\u0000';
    }

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

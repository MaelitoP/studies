import fr.Tp1;

import java.util.ArrayList;
import java.util.List;

public class Forme
{
    private int x0, y0, xLength, yLength;
    private char[][] shape;
    private char c;
    private int diff;

    public static List<Forme> list = new ArrayList<Forme>();

    public Forme(int x0, int y0, int xLength, int yLength)
    {
        this.x0 = x0;
        this.y0 = y0;
        this.xLength = xLength;
        this.yLength = yLength;
        this.shape = new char[yLength][xLength];
        this.c = '#';
        this.diff = 0;
    }

    public void init()
    {

    }

    public void setDiff(int i)
    {
        this.diff = i;
    }

    public int getDiff()
    {
        return this.diff;
    }

    public void setShape(char[][] s)
    {
        this.shape = s;
    }

    public char[][] getShape()
    {
        return this.shape;
    }

    public int getX0()
    {
        return this.x0;
    }

    public int getxLength()
    {
        return this.xLength;
    }

    public int getyLength()
    {
        return this.yLength;
    }

    public int getY0()
    {
        return this.y0;
    }

    public void setX0(int x0)
    {
        this.x0 = x0;
    }

    public void setY0(int y0)
    {
        this.y0   = y0;
    }

    public void add()
    {
        Tp1.getDraw().add(this);
        Forme.list.add(this);
    }

    public void remove()
    {
        Forme.list.remove(this);
    }

    public void setChar(char c)
    {
        this.c = c;
    }

    public char getChar()
    {
        return this.c;
    }

    @Override
    public String toString()
    {
        StringBuilder sb = new StringBuilder();
        for(int v = 0; v < this.yLength; v++)
        {
            for(int w = 0; w < this.xLength; w++)
            {
                sb.append(this.shape[v][w]);
            }
            sb.append("\n");
        }
        return sb.toString();
    }
}

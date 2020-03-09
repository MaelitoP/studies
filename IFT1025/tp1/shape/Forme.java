package fr.shape;

import fr.Tp1;

import java.util.ArrayList;
import java.util.List;

public abstract class Forme
{
    private int x0, y0, x1, y1, xLength, yLength;
    private char[][] shape;
    private char c;
    private int diff, diffX, diffY;
    private boolean isReverse;

    public Forme(int x0, int y0, int x1, int y1)
    {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;

        this.xLength = x1;
        this.yLength = y1;

        this.shape = new char[yLength][xLength];
        this.isReverse = false;
        this.c = '#';

        this.diff = 0;
        this.diffX = 0;
        this.diffY = 0;
    }

    public abstract void init();

    public boolean isReverse()
    {
        return this.isReverse;
    }

    public void setReverse(boolean b)
    {
        this.isReverse = b;
    }

    public void setXLength(int x)
    {
        this.xLength = x;
    }

    public void setYLength(int y)
    {
        this.yLength = y;
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

    public int getX1()
    {
        return this.x1;
    }

    public int getY1()
    {
        return this.y1;
    }

    public void setX0(int x0)
    {
        this.x0 = x0;
    }

    public void setY0(int y0)
    {
        this.y0 = y0;
    }

    public void setX1(int x1)
    {
        this.x1 = x1;
    }

    public void setY1(int y1)
    {
        this.y1 = y1;
    }

    public void add()
    {
        Tp1.getDraw().add(this);
    }

    public void setChar(char c)
    {
        this.c = c;
    }

    public char getChar()
    {
        return this.c;
    }

    public int getDiffX()
    {
        return this.diffX;
    }

    public void setDiffX(int diff)
    {
        this.diffX = diff;
    }

    public int getDiffY()
    {
        return this.diffY;
    }

    public void setDiffY(int diff)
    {
        this.diffY = diff;
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

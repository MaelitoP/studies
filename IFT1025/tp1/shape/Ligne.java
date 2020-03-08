package fr.shape;

/**
 * Draw a line from a point (x0, y0)
 * to a point (x1, y1)
 */
public class Ligne extends Forme
{
    public Ligne(int xx0, int yy0, int xx1, int yy1)
    {
        super(xx0, yy0, xx1, yy1);

        int xLength = (xx1-xx0+1) > 0 ? (xx1-xx0+1) : -(xx1-xx0-1);
        int yLength = (yy1-yy0+1) > 0 ? (yy1-yy0+1) : -(yy1-yy0-1);
        this.setXLength(xLength);
        this.setYLength(yLength);

        if(xx0 == 0) this.setXLength(xLength-1);
        if(yy0  == 0) this.setYLength(yLength-1);

        this.setShape(new char[this.getyLength()][this.getxLength()]);

        this.init();
    }

    @Override
    public void init()
    {
        char[][] array = getShape();
        int deltX = this.getxLength()-1;
        int deltY = this.getyLength()-1;
        float o;

        if(deltX > deltY)
        {
            if(xor(this.getY0() > this.getY1(), this.getX0() > this.getX1()))
            {
                int i = deltX;
                int w = 0;
                o = ((float)deltY / (float)deltX);
                while(i >= 0)
                {
                    array[Math.round(o*(float)w)][i] = this.getChar();
                    i--;
                    w++;
                }
            }
            else
            {
                o = ((float)deltY / (float)deltX);
                for(int v = 0; v < this.getxLength(); v++)
                    if(Math.round(o*(float)v) < this.getyLength())
                        array[Math.round(o*(float)v)][v] = this.getChar();
            }
        }
        else
        {
            if(xor(this.getY0() > this.getY1(), this.getX0() > this.getX1()))
            {
                int i = deltX;
                int w = 0;
                o = ((float)deltX / (float)deltY);
                while(i >= 0)
                {
                    array[i][Math.round(o*(float)w)] = this.getChar();
                    i--;
                    w++;
                }
            }
            else
            {
                o = ((float)deltX / (float)deltY);
                for(int v = 0; v < this.getyLength(); v++)
                    if(Math.round(o*(float)v) < this.getxLength())
                        array[v][Math.round(o*(float)v)] = this.getChar();
            }
        }

        if(this.getY0() > this.getY1()) this.setY0(this.getY1());
        if(this.getX0() > this.getX1()) this.setX0(this.getX1());

        this.setShape(array);
    }

    /**
     * XOR condition method
     * @param x
     * @param y
     * @return boolean true if (v,f) or (f,v), else it's false
     */
    public boolean xor(boolean x, boolean y)
    {
        return ( ( x || y ) && ! ( x && y ) );
    }
}

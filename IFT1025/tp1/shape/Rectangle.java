package fr.shape;

public class Rectangle extends Forme
{
    public Rectangle(int x0, int y0, int xLength, int yLength)
    {
        super(x0, y0, xLength, yLength);
        this.init();
    }

    @Override
    public void init()
    {
        char[][] array = getShape();
        for(int v = 0; v < this.getyLength(); v++)
            for(int w = 0; w < this.getxLength(); w++)
                array[v][w] = this.getChar();
        this.setShape(array);
    }
}

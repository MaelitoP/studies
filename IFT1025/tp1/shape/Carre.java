package fr.shape;

public class Carre extends Rectangle
{
    private int size;

    public Carre(int x0, int y0, int size)
    {
        super(x0, y0, size, size);
        this.size = size;
        this.init();
    }

    @Override
    public void init()
    {
        char[][] array = getShape();
        for(int v = 0; v < size; v++)
            for(int w = 0; w < size; w++)
                array[v][w] = this.getChar();
        this.setShape(array);
    }
}

package fr.shape;

public class Cercle extends Forme
{
    private int radius;

    public Cercle(int x0, int y0, int r)
    {
        super(x0, y0 , (r * 2) + 1, (r * 2) + 1);
        this.radius = r;
        this.init();
        this.setDiff(r);
    }

    @Override
    public void init()
    {
        char[][] arr = getShape();

        for (int i = 1; i <= this.getyLength(); i++)
            for (int j = 1; j <= this.getxLength(); j++)
            {
                int xSquared = (i - this.getX0()) * (i - this.getX0());
                int ySquared = (j - this.getY0()) * (j - this.getY0());

                if (Math.abs(xSquared + ySquared - radius * radius) < radius)
                    arr[i-1][j-1] = '#';
                else
                    arr[i-1][j-1] = '\u0000';
            }
        this.setShape(arr);
    }
}

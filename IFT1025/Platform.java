package model;

import javafx.scene.paint.Color;
import javafx.scene.canvas.GraphicsContext;
import view.GameView;

import java.util.Random;

enum PlatformType
{
    RED(Color.rgb(184, 15, 36), 0.05),
    YELLOW(Color.rgb(230, 221, 58), 0.10),
    ORANGE(Color.rgb(230, 134, 58), 0.65),
    GREEN(Color.LIGHTGREEN, 0.20);

    private Color c;
    private double spawn;

    PlatformType(Color c, double spawn)
    {
        this.c = c;
        this.spawn = spawn;
    }

    protected Color getColor() { return this.c; }
    protected double getSpawnPourcent() { return this.spawn; }
}

public class Platform extends Entity
{
    private PlatformType type;
    private boolean isDrawed;

    public Platform(double x, double y, PlatformType type)
    {
        this.x = x;
        this.y = y;
        this.height = 10;
        this.width = new Random().nextInt((175 - 80) + 1) + 80; // Random width in range [80-175]px
        this.type = type;
        this.color = type.getColor();
    }

    public boolean isDrawed() { return this.isDrawed; }

    public PlatformType getType()
    {
        return this.type;
    }

    @Override
    public void update(double dt, double offsetY)
    {
        if (x + width > GameView.WIDTH) x = GameView.WIDTH - width; // right limit borne
        if(x < 0) x = 0; // left limit borne
    }

    public void draw(GraphicsContext context, double offsetY)
    {
        context.setFill(color);
        context.fillRect(x, y - offsetY, width, height);
        this.isDrawed = true;
    }
}

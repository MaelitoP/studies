package model;

import javafx.scene.canvas.GraphicsContext;
import javafx.scene.paint.Color;
import view.GameView;

public abstract class Entity
{
    protected double width, height;
    protected double x, y;

    protected double vx, vy;
    protected double ax, ay;

    protected boolean left = false, right = false, jumping = false, falling = false;

    protected Color color;

    /**
     * Update pos & velocity
     * @param dt time out since last update()
     */
    public void update(double dt, double offsetY)
    {
        vx += Math.pow(dt, 2) * ax;
        vy += dt * ay;
        x += dt * vx;
        y += dt * vy;

        if (x + width > GameView.WIDTH) x = GameView.WIDTH - width; // right limit borne
        if(x < 0) x = 0; // left limit borne
    }

    public void setLeft(boolean b) { left = b; }
    public void setRight(boolean b) { right = b; }
    public void setJumping(boolean b) { jumping = b; }

    public abstract void draw(GraphicsContext context, double offsetY);
}

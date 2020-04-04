package view;

import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;

public class GameView
{
    public static int WIDTH = 350, HEIGHT = 480;
    private double offsetY, vy, ay;
    protected boolean accelerate;
    private Scene scene;
    private Canvas canvas;
    private Pane root;
    private GraphicsContext gc;

    public GameView()
    {
        this.root = new Pane();
        this.scene = new Scene(root, WIDTH, HEIGHT);
        this.canvas = new Canvas(WIDTH, HEIGHT*2);
        this.gc = this.canvas.getGraphicsContext2D();
        this.root.getChildren().add(this.canvas);
        this.accelerate = false;
        this.vy = -50;
        this.ay = 0;
        this.offsetY = 0;
    }

    public double getOffsetY() { return this.offsetY; }

    public void setOffsetY(double offsetY) { this.offsetY = offsetY; }

    public void update(double dt)
    {
        this.offsetY += dt * vy;
        vy += Math.pow(dt, 2) * 2;
    }

    public void setVy(double vy) { this.vy = vy; }
    public double getVy() { return this.vy; }

    public void setAccelerate(boolean b) { this.accelerate = b; }
    public boolean isAccelerate() { return this.accelerate; }

    public void draw()
    {
        this.gc.clearRect(0, 0, WIDTH, HEIGHT);
        this.gc.setFill(Color.CORNFLOWERBLUE);
        this.gc.fillRect(0, 0, WIDTH, HEIGHT);
    }

    public Scene getScene()
    {
        return this.scene;
    }

    public Canvas getCanvas()
    {
        return this.canvas;
    }

    public GraphicsContext getGC()
    {
        return this.gc;
    }
}

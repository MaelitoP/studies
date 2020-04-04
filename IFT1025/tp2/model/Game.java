package model;

import javafx.scene.canvas.GraphicsContext;
import view.GameView;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Game
{
    private List<Platform> platforms = new ArrayList<>();
    private Jellyfish player;
    private int score;
    private Platform lastPlat;

    public static boolean isStarted = false;

    public Game()
    {
        this.player = new Jellyfish((GameView.WIDTH / 2) - (50 / 2),
                GameView.HEIGHT - 50);
        this.score = 0;
        initPlateforms();
    }

    public List<Platform> getPlatforms() { return this.platforms; }

    public Jellyfish getPlayer() { return this.player; }

    public void initPlateforms()
    {
        Platform current;
        double size = Math.round((GameView.HEIGHT)/90);

        for (int i = (int)(size - 1); i >= 0; i--)
        {
            current = new Platform(Math.random() * GameView.WIDTH, (double) i / size * GameView.HEIGHT, getNextPlateform());
            platforms.add(current);
            lastPlat = current;
        }
    }

    public Platform getLastPlat()
    {
        return platforms.get(platforms.size()-1);
    }

    public PlatformType getNextPlateform()
    {
        Random rand;
        PlatformType type = null;

        if(platforms.size() != 0 && lastPlat.getType().equals(PlatformType.RED))
        {
            rand = new Random();
            int n = rand.nextInt((3 - 1) + 1) + 1;
            switch (n)
            {
                case 1: type = PlatformType.ORANGE; break;
                case 2: type = PlatformType.GREEN; break;
                case 3: type = PlatformType.YELLOW; break;
            }
        }
        else
        {
            rand = new Random();
            int pourcent = rand.nextInt(100);

            if(pourcent >= 0 && pourcent <= 5) type = PlatformType.RED;
            else if(pourcent > 5 && pourcent <= 10) type = PlatformType.YELLOW;
            else if(pourcent > 10 && pourcent <= 20) type = PlatformType.GREEN;
            else if(pourcent > 20) type = PlatformType.ORANGE;
        }

        return type;
    }

    public void update(double dt, GraphicsContext context, double offsetY, GameView view)
    {
        if (this.player.y > GameView.HEIGHT) {
            //TODO Fall & loose
            System.out.println("DEEEAD!");
        }
        else
        {
            player.onGround(false);
            for (Platform p : platforms)
            {
                double x = getPlayer().y + getPlayer().height - (p.y-offsetY);
                if(x >= -1 && x <= 1)
                    player.onGround(true);
                p.update(dt, offsetY);
                if(p.getType().equals(PlatformType.ORANGE)) player.testCollisionOrange(p, offsetY);
                else if(p.getType().equals(PlatformType.RED)) player.testCollisionRed(p, offsetY);
                else if(p.getType().equals(PlatformType.GREEN))
                {
                    if (player.testCollisionGreen(p, offsetY))
                        if (player.vy > -100)
                            player.vy = 100;
                }
                else if(p.getType().equals(PlatformType.YELLOW))
                {
                    if(player.testCollisionYellow(p, offsetY))
                    {
                        view.setVy(view.getVy()*3);
                        view.setAccelerate(true);
                    }
                }
                else
                    if(view.isAccelerate())
                    {
                        view.setVy(view.getVy()/3);
                        view.setAccelerate(false);
                    }
            }
            player.testBorderCollision();
            player.update(dt, offsetY);
        }
    }

    public void draw(GraphicsContext context, double offsetY)
    {

        player.draw(context, offsetY);
        for (Platform p : platforms)
            p.draw(context, offsetY);
    }
}

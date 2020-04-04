package model;

import javafx.scene.canvas.GraphicsContext;
import javafx.scene.image.Image;
import view.GameView;

/**
 * Player class
 */
public class Jellyfish extends Entity
{
    private Image[] framesR, framesL; // left & right image frames
    private Image image;
    private double frameRate = 8; // par second
    private double time = 0;

    private boolean onGround;
    private boolean falling = false;

    public Jellyfish(double x, double y)
    {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;

        this.ay = 1200; // gravity
        this.vx = 0; // x velocity

        // Spirits load
        framesR = new Image[]{
                new Image("./ressource/jellyfish1.png"),
                new Image("./ressource/jellyfish2.png"),
                new Image("./ressource/jellyfish3.png"),
                new Image("./ressource/jellyfish4.png"),
                new Image("./ressource/jellyfish5.png"),
                new Image("./ressource/jellyfish6.png")
        };
        framesL = new Image[]{
                new Image("./ressource/jellyfish1g.png"),
                new Image("./ressource/jellyfish2g.png"),
                new Image("./ressource/jellyfish3g.png"),
                new Image("./ressource/jellyfish4g.png"),
                new Image("./ressource/jellyfish5g.png"),
                new Image("./ressource/jellyfish6g.png")
        };
        image = framesL[0];
    }

    @Override
    public void update(double dt, double offsetY)
    {
        super.update(dt, offsetY);
        if(y >= GameView.HEIGHT - 50)
            y = GameView.HEIGHT - 50;

        getNextPosition(dt);

        // Update spirits
        time += dt;
        int frame = (int) (time * frameRate);
        image = (left ? framesL[frame % framesL.length] : framesR[frame % framesR.length]);
    }

    private void getNextPosition(double dt)
    {
        // Movement
        if (left)
        {
            this.ax = -1200;
            if(vx < 1200) vx = -1200;
        }
        else if (right)
        {
            this.ax = 1200;
            if(vx < 1200) vx = 1200;
        }
        else
        {
            if(vx > 0)
            {
                vx -= 1200;
                if(vx < 0) vx = 0;
            }
            else if(vx < 0)
            {
                vx += 1200;
                if(vx > 0) vx = 0;
            }
        }
    }

    /**
     * La collision avec une plateforme a lieu seulement si :
     *
     * - Il y a une intersection entre la plateforme et le personnage
     *
     * - La collision a lieu entre la plateforme et le *bas du personnage*
     * seulement
     *
     * - La vitesse va vers le bas (le personnage est en train de tomber,
     * pas en train de sauter)
     */
    public boolean testCollisionRed(Platform other, double offsetY)
    {
        if(intersects(other, offsetY) && Math.abs(this.y - (other.y-offsetY)) <= 10)
        {
            pushDown(other, offsetY);
            vy = 0; // restrict access by down
            this.onGround = false;
        }
        else if (intersects(other, offsetY) && Math.abs(this.y + height - (other.y-offsetY)) < 10 && vy > 0)
        {
            pushOut(other, offsetY);
            this.vy = 0;
            this.onGround = true;
            return true;
        }
        return false;
    }

    public boolean testCollisionGreen(Platform other, double offsetY)
    {
        if (intersects(other, offsetY) && Math.abs(this.y + height - (other.y-offsetY)) < 10 && vy > 0)
        {
            pushOut(other, offsetY);
            this.vy *= -1.5;
            this.onGround = true;
            return true;
        }
        else return false;
    }

    public boolean testCollisionYellow(Platform other, double offsetY)
    {
        if (intersects(other, offsetY) && Math.abs(this.y + height - (other.y-offsetY)) < 10 && vy > 0)
        {
            pushOut(other, offsetY);
            this.vy = 0;
            // TODO Acceelerate the screen
            this.onGround = true;
            return true;
        }
        else return false;
    }

    public boolean testCollisionOrange(Platform other, double offsetY)
    {
        if (intersects(other, offsetY) && Math.abs(this.y + height - (other.y-offsetY)) < 10 && vy > 0)
        {
            pushOut(other, offsetY);
            this.vy = 0;
            this.onGround = true;
            return true;
        }
        else return false;
    }

    public boolean testBorderCollision()
    {
        if(this.y >= (GameView.HEIGHT - 50) && !(Game.isStarted))
        {
            this.onGround = true;
            return true;
        }
        else return false;
    }

    public boolean intersects(Platform other, double offsetY)
    {
        return !( x + width < other.x
                        || other.x + other.width < this.x
                        || y + height < (other.y-offsetY)
                        || (other.y-offsetY) + other.height < this.y);
    }

    /**
     * Repousse le personnage vers le haut de la plateforme (sans la déplacer)
     */
    public void pushOut(Platform other, double offsetY)
    {
        double deltaY = this.y + this.height - (other.y-offsetY);
        this.y -= deltaY;
    }


    /**
     * Repousse le personnage vers le bas de la plateforme (sans la déplacer)
     */
    public void pushDown(Platform other, double offsetY)
    {
        double deltaY = this.y - (other.y-offsetY);
        this.y += deltaY;
    }

    public void onGround(boolean onGround)
    {
        this.onGround = onGround;
    }

    public boolean isOnGround() { return this.onGround; }

    public void jump()
    {
        if(onGround)
        {
            this.vy = -600;
            jumping = true;
        }
    }

    @Override
    public void draw(GraphicsContext context, double offsetY)
    {
        context.drawImage(image, x, y, width, height);
    }
}

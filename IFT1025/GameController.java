package controller;

import javafx.application.Platform;
import javafx.scene.canvas.GraphicsContext;
import model.Game;
import view.GameView;

public class GameController
{
    private GameView gameView;
    private Game game;

    public GameController()
    {
        this.gameView = new GameView();
        this.game = new Game();
        this.registerEvent(); // Key pressed event
    }

    public void update(double time, GraphicsContext context)
    {
        this.gameView.update(time);
        this.game.update(time, context, this.gameView.getOffsetY(), this.gameView);
    }

    public void draw(GraphicsContext context, double offsetY)
    {
        this.gameView.draw();
        this.game.draw(context, offsetY);
    }

    public void registerEvent()
    {
        this.gameView.getScene().setOnKeyPressed(e -> {
                switch(e.getCode())
                {
                    case LEFT:
                        this.game.getPlayer().setLeft(true);
                        break;
                    case RIGHT:
                        this.game.getPlayer().setRight(true);
                        break;
                    case SPACE:
                        this.game.getPlayer().jump();
                        break;
                    case ESCAPE:
                        Platform.exit();
                        break;
                    case A:
                        break;
                    case T:
                        break;
                }
            });

        this.gameView.getScene().setOnKeyReleased(e -> {
            switch(e.getCode())
            {
                case LEFT:
                    this.game.getPlayer().setLeft(false);
                    break;
                case RIGHT:
                    this.game.getPlayer().setRight(false);
                    break;
                case SPACE:
                    this.game.getPlayer().setJumping(false);
                    break;
                case ESCAPE:
                    Platform.exit();
                    break;
                case T:
                    break;
            }
        });
    }

    public Game getGame()
    {
        return this.game;
    }

    public GameView getGameView()
    {
        return this.gameView;
    }
}

import controller.GameController;

import javafx.animation.AnimationTimer;
import javafx.application.Application;
import javafx.scene.image.Image;
import javafx.scene.input.KeyEvent;
import javafx.stage.Stage;

import javax.imageio.ImageIO;
import java.io.IOException;

/**
 * HighSeaTower Game for IFT1025 course
 * @author Maël LE PETIT
 * @version 0.1
 */
public class HighSeaTower extends Application
{
    GameController hst;

    @Override
    public void start(Stage primaryStage)
    {
        hst = new GameController();

        primaryStage.setTitle("High Sea Tower");
        primaryStage.setResizable(false);
        primaryStage.getIcons().add(new Image("/ressource/jellyfish1.png"));

        AnimationTimer timer = new AnimationTimer() {
            private long lastTime = 0;

            @Override
            public void handle(long now) {
                if (lastTime == 0) {
                    lastTime = now;
                    return;
                }

                double deltaTime = (now - lastTime) * 1e-9;

                hst.update(deltaTime, hst.getGameView().getGC());
                hst.draw(hst.getGameView().getGC(), hst.getGameView().getOffsetY());
                lastTime = now;
            }
        };
        timer.start();

        primaryStage.setScene(hst.getGameView().getScene());
        primaryStage.show();
    }

    public static void main(String[] args)
    {
        launch(args);
    }
}
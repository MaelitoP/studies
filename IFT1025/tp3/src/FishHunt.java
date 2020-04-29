import controller.Controller;
import javafx.animation.AnimationTimer;
import javafx.application.Application;
import javafx.scene.image.Image;
import javafx.stage.Stage;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * FishHunt Game for IFT1025 course
 * @author Maël LE PETIT
 *         Alex BUSSING
 * @version 1.0.0
 */
public class FishHunt extends Application
{
    Controller controller;
    ScheduledExecutorService basicSpawnThread, specialSpawnThread, bubbleAnimationThread;

    @Override
    public void start(Stage primaryStage)
    {
        primaryStage.setTitle("Fish Hunt");
        primaryStage.setResizable(false);
        primaryStage.getIcons().add(new Image("/ressources/fish/00.png"));

        // Setting main controller
        controller = new Controller(primaryStage);

        // Main thread
        AnimationTimer timer = new AnimationTimer()
        {
            private long lastTime = 0;
            private long startTime = 0;
            private long levelStart = 0;

            // Game thread
            @Override
            public void handle(long now)
            {
                if (lastTime == 0)
                {
                    lastTime = now;
                    return;
                }
                if (startTime == 0)
                {
                    startTime = now;
                    return;
                }
                if(levelStart == 0 && controller.getGameController().getGame().isStarted())
                    levelStart = now;

                double deltaTime = (now - lastTime) * 1e-9; // Get time in seconds
                double deltaTimeSinceStart = (now - startTime);
                double deltaTimeSinceLevelStart = 0;

                // Get time since the first level has been setting
                if(controller.getGameController().getGame().isStarted())
                    deltaTimeSinceLevelStart = (now - levelStart) * 1e-9;

                // Update game setting
                controller.update(deltaTime, deltaTimeSinceStart, deltaTimeSinceLevelStart, primaryStage);

                lastTime = now; // interval every frame
            }
        };
        timer.start();

        // Entities spawns
        /* basic entity */
        Runnable basicFishes = () -> {
            if(controller.getGameController().getGame().isStarted())
                controller.getGameController().addEntities(false);
        };
        /* special entity */
        Runnable specialFishes = () -> {
            if(controller.getGameController().getGame().isStarted() && controller.getGameController().getGame().getLevel() > 1
                    && !controller.getGameController().getGameView().getLevelLabel().isVisible())
                controller.getGameController().addEntities(true);
        };
        /* bubbles */
        Runnable bubbleRunnable = () -> {
            if(controller.getGameController().getGame().isStarted())
                controller.getGameController().sendBubble();
        };

        basicSpawnThread = Executors.newScheduledThreadPool(0);
        basicSpawnThread.scheduleAtFixedRate(basicFishes, 0, 3, TimeUnit.SECONDS);

        specialSpawnThread = Executors.newScheduledThreadPool(0);
        specialSpawnThread.scheduleAtFixedRate(specialFishes, 0, 5, TimeUnit.SECONDS);

        bubbleAnimationThread = Executors.newScheduledThreadPool(0);
        bubbleAnimationThread.scheduleAtFixedRate(bubbleRunnable, 0, 3, TimeUnit.SECONDS);

        primaryStage.setScene(controller.getMenuController().getMenuView().getScene());
        primaryStage.show();

        // Stop spawn thread
        primaryStage.setOnCloseRequest(event -> {
            basicSpawnThread.shutdown();
            specialSpawnThread.shutdown();
            bubbleAnimationThread.shutdown();
        });
    }

    public static void main(String[] args)
    {
        launch(args);
    }
}

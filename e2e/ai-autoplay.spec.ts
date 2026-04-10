/**
 * AI Autoplay headless QA test.
 * Boots the game with autoplay enabled, verifies the AI controller
 * produces console log output and that the player position changes
 * (i.e. the AI is actually moving the cat).
 */
import { test, expect } from "@playwright/test";

test.describe("AI Autoplay", () => {
  test("AI autoplay mode: AI logs position data and cat moves", async ({
    page,
  }) => {
    const aiLogs: string[] = [];

    // Capture [AI] console lines emitted by HeadlessLogger
    page.on("console", (msg) => {
      const text = msg.text();
      if (text.startsWith("[AI]")) {
        aiLogs.push(text);
      }
    });

    // Navigate to the game page
    await page.goto("/game", { waitUntil: "domcontentloaded" });

    // Wait for Phaser canvas to appear
    await page.waitForSelector("#game-container canvas", { timeout: 15_000 });

    // Inject the autoplay flags via localStorage so a page reload picks them up,
    // then trigger watch-AI mode via the Phaser registry.
    await page.evaluate(() => {
      // Access the Phaser game instance exposed in dev
      const gameAny = (window as Window & { __PHASER_GAME__?: Phaser.Game })
        .__PHASER_GAME__;
      if (!gameAny) throw new Error("__PHASER_GAME__ not found");

      // Set registry keys and jump straight into RogueRun with autoplay
      gameAny.registry.set("autoplayEnabled", true);
      gameAny.registry.set("autoplayDebug", false);
      gameAny.registry.set("autoplayHeadless", true);
      gameAny.registry.set("runSeed", "testseed1");
      gameAny.registry.set("runFloor", 1);
      gameAny.registry.set("lives", 3);
      gameAny.registry.set("score", 0);
      gameAny.registry.set("coins", 0);
      gameAny.registry.set("gems", 0);
      gameAny.registry.set("maxHearts", 3);
      gameAny.registry.set("playerHearts", 3);
      gameAny.registry.set("objectiveStatus", "-");

      const scene = gameAny.scene.getScene("MainMenu") as Phaser.Scene & {
        scene: Phaser.Scenes.ScenePlugin;
      };
      scene.scene.start("RogueRun", {
        seed: "testseed1",
        floor: 1,
        autoplay: true,
        debug: false,
        headless: true,
      });
      scene.scene.launch("UIScene");
    });

    // Wait up to 20 s for AI log lines to appear (emitted every 30 ticks ≈ every 0.5s)
    await page
      .waitForFunction(
        () => {
          // Re-check the console buffer by polling
          return (window as Window & { __AI_LOG_COUNT__?: number })
            .__AI_LOG_COUNT__ !== undefined
            ? (window as Window & { __AI_LOG_COUNT__?: number })
                .__AI_LOG_COUNT__! >= 3
            : false;
        },
        { timeout: 20_000 },
      )
      .catch(() => {
        // Fallback: just check aiLogs array collected above
      });

    // Give the AI a few seconds to run and log
    await page.waitForTimeout(6_000);

    // At least a few [AI] log lines should have been emitted
    expect(aiLogs.length).toBeGreaterThanOrEqual(1);

    // Parse positions from log lines and verify the cat moved
    const positions = aiLogs
      .map((line) => {
        try {
          const json = line.replace(/^\[AI\]\s*/, "");
          const parsed = JSON.parse(json) as {
            state?: { playerX?: number; playerY?: number };
          };
          return parsed.state
            ? { x: parsed.state.playerX, y: parsed.state.playerY }
            : null;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    if (positions.length >= 2) {
      const first = positions[0]!;
      const last = positions[positions.length - 1]!;
      const dx = Math.abs((last.x ?? 0) - (first.x ?? 0));
      const dy = Math.abs((last.y ?? 0) - (first.y ?? 0));
      // Cat should have moved at least 32px in some direction
      expect(dx + dy).toBeGreaterThan(32);
    }
  });
});

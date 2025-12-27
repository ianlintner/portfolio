import { test, expect, type Page } from "@playwright/test";

async function waitForGame(page: Page) {
  // GameWrapper renders a fixed-size container (800x600) and Phaser injects a <canvas>.
  await page.waitForSelector("#game-container canvas", {
    state: "visible",
    timeout: 60_000,
  });

  // We expose the Phaser game instance in dev for testing.
  await page.waitForFunction(
    () => Boolean((globalThis as any).__PHASER_GAME__),
    undefined,
    { timeout: 60_000 },
  );
}

async function freezeGameLoop(page: Page) {
  await page.evaluate(() => {
    const game = (globalThis as any).__PHASER_GAME__ as any;
    if (!game) return;

    // Freezing both the loop and the active scene(s) makes screenshots stable.
    if (game.loop?.sleep) game.loop.sleep();
    if (game.scene?.pause) {
      // Pause whichever scenes are currently active.
      for (const scene of game.scene.getScenes(true) ?? []) {
        game.scene.pause(scene.scene.key);
      }
    }
  });
}

test.describe("/game visual QA", () => {
  test("renders main menu", async ({ page }) => {
    await page.goto("/game", { waitUntil: "networkidle" });
    await waitForGame(page);

    await freezeGameLoop(page);
    await expect(page.locator("#game-container canvas")).toHaveScreenshot(
      "game-menu.png",
    );
  });

  test("start run shows gameplay", async ({ page }) => {
    // Make run seed deterministic: MainMenu generates seed via Math.random().
    await page.addInitScript(() => {
      Math.random = () => 0.123456789;
    });

    await page.goto("/game", { waitUntil: "networkidle" });
    await waitForGame(page);

    // The Start Run button is Phaser text at (400, 300). Click the canvas.
    const canvas = page.locator("#game-container canvas");
    await canvas.click({ position: { x: 400, y: 300 } });

    await page.waitForFunction(
      () => {
        const game = (globalThis as any).__PHASER_GAME__ as any;
        if (!game) return false;
        // The RogueRun scene should become active.
        return Boolean(game.scene?.isActive?.("RogueRun"));
      },
      undefined,
      { timeout: 60_000 },
    );

    // Let at least one frame render before freezing.
    await page.waitForTimeout(250);
    await freezeGameLoop(page);

    await expect(page.locator("#game-container canvas")).toHaveScreenshot(
      "game-run-floor1.png",
    );
  });
});

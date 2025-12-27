import { expect, test } from "@playwright/test";

test.describe("/game", () => {
  test("boots Phaser and reaches MainMenu", async ({ page }) => {
    await page.goto("/game", { waitUntil: "domcontentloaded" });

    // Page shell should render even if Phaser fails.
    await expect(
      page.getByRole("heading", { name: "Cat Adventure", exact: true }),
    ).toBeVisible();

    // If our bootstrap throws, we surface an explicit overlay. Treat that as failure.
    await expect(page.getByText("Game failed to start")).toHaveCount(0);

    const container = page.locator("#game-container");
    await expect(container).toBeVisible();

    // Phaser should create a canvas inside the container.
    await expect(container.locator("canvas")).toHaveCount(1, {
      timeout: 45_000,
    });

    // In dev/test we expose the Phaser game instance globally.
    await page.waitForFunction(
      () => {
        const g = (window as any).__PHASER_GAME__;
        return Boolean(g) && Boolean(g.scene) && g.scene.isActive("MainMenu");
      },
      undefined,
      { timeout: 45_000 },
    );
  });
});

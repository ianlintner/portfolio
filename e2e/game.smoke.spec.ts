import { expect, test } from "@playwright/test";

test.describe("/game", () => {
  test("boots Phaser and reaches MainMenu", async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      pageErrors.push(err?.message ?? String(err));
    });

    await page.goto("/game", { waitUntil: "domcontentloaded" });

    // Page shell should render even if Phaser fails.
    await expect(
      page.getByRole("heading", { name: "Cat Adventure", exact: true }),
    ).toBeVisible();

    // If our bootstrap throws, we surface an explicit overlay. Treat that as failure.
    await expect(page.getByText("Game failed to start")).toHaveCount(0);

    const container = page.locator("#game-container");
    try {
      await expect(container).toBeVisible({ timeout: 45_000 });
    } catch {
      // If the client bundle failed to hydrate, Next will render nothing for the
      // ssr:false dynamic component. Print console/page errors for diagnosis.
      throw new Error(
        [
          "#game-container never became visible.",
          consoleErrors.length
            ? `Console errors:\n- ${consoleErrors.join("\n- ")}`
            : "Console errors: <none>",
          pageErrors.length
            ? `Page errors:\n- ${pageErrors.join("\n- ")}`
            : "Page errors: <none>",
        ].join("\n\n"),
      );
    }

    // Phaser should create a canvas inside the container.
    await expect(container.locator("canvas")).toHaveCount(1, {
      timeout: 45_000,
    });

    // In dev/test we expose the Phaser game instance globally.
    await page.waitForFunction(() => Boolean((window as any).__PHASER_GAME__), {
      timeout: 45_000,
    });

    // Then wait for the MainMenu to become active. If this times out, it usually
    // means the Preloader crashed or got stuck due to a missing/invalid asset.
    try {
      await page.waitForFunction(
        () => {
          const g = (window as any).__PHASER_GAME__ as any;
          return Boolean(g?.scene?.isActive?.("MainMenu"));
        },
        undefined,
        { timeout: 45_000 },
      );
    } catch {
      throw new Error(
        [
          "Phaser mounted, but MainMenu never became active.",
          consoleErrors.length
            ? `Console errors:\n- ${consoleErrors.join("\n- ")}`
            : "Console errors: <none>",
          pageErrors.length
            ? `Page errors:\n- ${pageErrors.join("\n- ")}`
            : "Page errors: <none>",
        ].join("\n\n"),
      );
    }
  });

  test("autoplay headless mode logs QA state and advances into RogueRun", async ({
    page,
  }) => {
    const aiLogs: string[] = [];

    page.on("console", (msg) => {
      const text = msg.text();
      if (text.startsWith("[AI] ")) {
        aiLogs.push(text);
      }
    });

    await page.goto("/game?headless=1&autoplay=1", {
      waitUntil: "domcontentloaded",
    });

    await page.waitForFunction(() => Boolean((window as any).__PHASER_GAME__), {
      timeout: 45_000,
    });

    await page.waitForFunction(
      () => {
        const g = (window as any).__PHASER_GAME__ as any;
        return Boolean(g?.scene?.isActive?.("RogueRun"));
      },
      undefined,
      { timeout: 45_000 },
    );

    await page.waitForFunction(
      () => {
        const qa = (window as any).__PHASER_QA__;
        return Boolean(qa?.logs?.length >= 3 && qa?.lastState?.playerX != null);
      },
      undefined,
      { timeout: 45_000 },
    );

    const qaSnapshot = await page.evaluate(() => {
      const qa = (window as any).__PHASER_QA__;
      return {
        logCount: qa?.logs?.length ?? 0,
        state: qa?.lastState,
        input: qa?.lastInput,
      };
    });

    expect(qaSnapshot.logCount).toBeGreaterThanOrEqual(3);
    expect(qaSnapshot.state.playerX).toBeGreaterThan(0);
    expect(qaSnapshot.state.floor).toBeGreaterThanOrEqual(1);
    expect([true, false]).toContain(Boolean(qaSnapshot.input.right));
    expect(aiLogs.length).toBeGreaterThanOrEqual(1);
  });
});

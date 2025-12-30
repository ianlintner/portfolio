import { test, expect, type Page } from "@playwright/test";

type DebugCapture = {
  consoleErrors: string[];
  pageErrors: string[];
};

function attachDebugCapture(page: Page): DebugCapture {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => {
    pageErrors.push(err?.message ?? String(err));
  });

  return { consoleErrors, pageErrors };
}

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

async function waitForSceneActive(page: Page, sceneKey: string) {
  try {
    await page.waitForFunction(
      (key) => {
        const game = (globalThis as any).__PHASER_GAME__ as any;
        if (!game?.scene?.isActive) return false;
        return Boolean(game.scene.isActive(key));
      },
      sceneKey,
      // Keep this well under the overall test timeout so we have time to
      // collect diagnostics before Playwright tears down the page.
      { timeout: 45_000 },
    );
  } catch {
    let state: unknown = { hasGame: false, scenes: [] as unknown[] };
    try {
      state = await page.evaluate(() => {
        const game = (globalThis as any).__PHASER_GAME__ as any;
        if (!game?.scene)
          return { hasGame: Boolean(game), scenes: [], activeKeys: [] };

        const allScenes = (game.scene.getScenes?.(false) ?? []) as any[];
        const activeScenes = (game.scene.getScenes?.(true) ?? []) as any[];

        const scenes = allScenes.map((s) => {
          const key = s?.sys?.settings?.key ?? s?.scene?.key;
          const active = Boolean(s?.sys?.settings?.active);
          const visible = Boolean(s?.sys?.settings?.visible);
          const sleeping = Boolean(s?.sys?.isSleeping?.());
          const status = s?.sys?.settings?.status;
          return { key, active, visible, sleeping, status };
        });

        const activeKeys = activeScenes.map(
          (s) => s?.sys?.settings?.key ?? s?.scene?.key,
        );

        return { hasGame: Boolean(game), scenes, activeKeys };
      });
    } catch (err) {
      state = { error: err instanceof Error ? err.message : String(err) };
    }

    throw new Error(
      `Timed out waiting for scene '${sceneKey}' to become active. State: ${JSON.stringify(
        state,
      )}`,
    );
  }
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
  // These tests load lots of assets and are more stable when run serially against
  // a single dev server.
  test.describe.configure({ mode: "serial" });

  // Keep an overall budget that allows for slow asset loads on cold start.
  test.setTimeout(120_000);

  test("renders main menu", async ({ page }) => {
    const dbg = attachDebugCapture(page);

    await page.goto("/game", { waitUntil: "domcontentloaded" });
    await waitForGame(page);
    await waitForSceneActive(page, "MainMenu");

    await freezeGameLoop(page);
    await expect(page.locator("#game-container canvas")).toHaveScreenshot(
      "game-menu.png",
      {
        // Canvas rendering can vary slightly (GPU/font rasterization, timing).
        // Allow small diffs while still catching real regressions.
        maxDiffPixelRatio: 0.05,
      },
    );

    // If there were console/page errors, fail explicitly (helps avoid silent regressions).
    expect(
      {
        consoleErrors: dbg.consoleErrors,
        pageErrors: dbg.pageErrors,
      },
      "Unexpected console/page errors while rendering main menu",
    ).toEqual({ consoleErrors: [], pageErrors: [] });
  });

  test("start run shows gameplay", async ({ page }) => {
    const dbg = attachDebugCapture(page);

    await page.goto("/game", { waitUntil: "domcontentloaded" });
    await waitForGame(page);
    try {
      await waitForSceneActive(page, "MainMenu");
    } catch (err) {
      throw new Error(
        [
          err instanceof Error ? err.message : String(err),
          dbg.consoleErrors.length
            ? `Console errors:\n- ${dbg.consoleErrors.join("\n- ")}`
            : "Console errors: <none>",
          dbg.pageErrors.length
            ? `Page errors:\n- ${dbg.pageErrors.join("\n- ")}`
            : "Page errors: <none>",
        ].join("\n\n"),
      );
    }

    // Start run via Phaser scene API (more reliable than clicking a canvas pixel).
    await page.evaluate(() => {
      const game = (globalThis as any).__PHASER_GAME__ as any;
      if (!game) throw new Error("__PHASER_GAME__ is not set");

      // Use a fixed seed for deterministic screenshots without touching global
      // Math.random (Phaser uses it internally).
      const seed = "playwright-seed";
      game.registry?.set?.("runSeed", seed);
      game.registry?.set?.("runFloor", 1);
      game.registry?.set?.("lives", 3);
      game.registry?.set?.("score", 0);

      // SceneManager doesn't expose launch(); use a ScenePlugin instead.
      const menu = game.scene.getScene?.("MainMenu");
      if (!menu?.scene) throw new Error("MainMenu scene is not available");

      menu.scene.start("RogueRun", { seed, floor: 1 });
      menu.scene.launch("UIScene");
      menu.scene.bringToTop("UIScene");
    });

    try {
      await waitForSceneActive(page, "RogueRun");
    } catch (err) {
      throw new Error(
        [
          err instanceof Error ? err.message : String(err),
          dbg.consoleErrors.length
            ? `Console errors:\n- ${dbg.consoleErrors.join("\n- ")}`
            : "Console errors: <none>",
          dbg.pageErrors.length
            ? `Page errors:\n- ${dbg.pageErrors.join("\n- ")}`
            : "Page errors: <none>",
        ].join("\n\n"),
      );
    }

    // Regression guard: the cat sprite should not be visibly below the floor.
    // We approximate this by ensuring the sprite's bottom aligns closely with
    // the Arcade body bottom (which is what collides with tiles).
    const alignment = await page.evaluate(() => {
      const game = (globalThis as any).__PHASER_GAME__ as any;
      const rr = game?.scene?.getScene?.("RogueRun");
      const p = rr?.player;
      const body = p?.body;
      const spriteBottom = p ? p.y + p.displayHeight / 2 : null;
      const bodyBottom = body ? body.bottom : null;
      const delta =
        spriteBottom != null && bodyBottom != null
          ? Math.abs(spriteBottom - bodyBottom)
          : null;
      return { hasPlayer: Boolean(p), spriteBottom, bodyBottom, delta };
    });

    expect(
      alignment,
      `Player sprite/body alignment unexpected: ${JSON.stringify(alignment)}`,
    ).toMatchObject({ hasPlayer: true });
    expect(alignment.delta).not.toBeNull();
    expect(alignment.delta as number).toBeLessThanOrEqual(2);

    // Composition guard: keep the player (and therefore the floor/platforms)
    // in the lower half of the viewport so the level doesn't read as "too high".
    const composition = await page.evaluate(() => {
      const game = (globalThis as any).__PHASER_GAME__ as any;
      const rr = game?.scene?.getScene?.("RogueRun");
      const cam = rr?.cameras?.main;
      const p = rr?.player;
      const screenY = cam && p ? p.y - cam.scrollY : null;
      const followOffsetY = cam?.followOffset?.y ?? null;
      const height = cam?.height ?? null;
      const expected =
        height != null && followOffsetY != null
          ? height / 2 - followOffsetY
          : null;
      return {
        hasCamera: Boolean(cam),
        hasPlayer: Boolean(p),
        screenY,
        followOffsetY,
        height,
        expected,
        scrollY: cam?.scrollY ?? null,
        playerY: p?.y ?? null,
      };
    });

    expect(
      composition,
      `Unexpected camera/player composition: ${JSON.stringify(composition)}`,
    ).toMatchObject({ hasCamera: true, hasPlayer: true });
    expect(composition.screenY).not.toBeNull();
    // With an 800x600 viewport, screenY should land around ~440 when followOffsetY=-140.
    // Use a generous window to avoid platform differences.
    expect(composition.screenY as number).toBeGreaterThan(360);
    expect(composition.screenY as number).toBeLessThan(520);

    // Let at least one frame render before freezing.
    await page.waitForTimeout(250);
    await freezeGameLoop(page);

    await expect(page.locator("#game-container canvas")).toHaveScreenshot(
      "game-run-floor1.png",
      {
        maxDiffPixelRatio: 0.05,
      },
    );

    expect(
      {
        consoleErrors: dbg.consoleErrors,
        pageErrors: dbg.pageErrors,
      },
      "Unexpected console/page errors while starting a run",
    ).toEqual({ consoleErrors: [], pageErrors: [] });
  });
});

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  // The HTML reporter can start a local server on failure which looks like a
  // "hung" terminal in automation. Prefer a non-interactive reporter by default.
  // If you want the HTML report locally, run: pnpm exec playwright show-report
  reporter: process.env.CI
    ? "github"
    : [
        ["line"],
        ["html", { open: "never" }],
      ],
  use: {
    baseURL: "http://127.0.0.1:3000",
    // Game is a fixed 800x600 canvas; keep the browser viewport predictable.
    viewport: { width: 900, height: 700 },
    deviceScaleFactor: 1,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "PORT=3000 pnpm dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

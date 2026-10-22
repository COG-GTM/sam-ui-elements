import { defineConfig } from "@playwright/test";
import baseConfig from "./playwright.config";

// Dedicated config for the WCAG 2.1 AA gate (GSA/sam-ui-elements#708),
// mirroring `playwright.a11y.config.{mjs,ts}` in sam-styles and ngx-uswds.
// Reuses the base Playwright setup (same `ng serve` webServer) but points at
// the accessibility spec dir and runs serially with a generous timeout because
// axe walks every test-app route in a single worker.
export default defineConfig({
  ...baseConfig,
  testDir: "./e2e/accessibility",
  testIgnore: [],
  timeout: 600_000,
  fullyParallel: false,
  workers: 1,
});

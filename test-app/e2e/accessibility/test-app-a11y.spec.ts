import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Runtime WCAG 2.1 AA gate for sam-ui-elements (GSA/sam-ui-elements#708).
// Walks every routed test-app gallery page with axe-core and compares the
// rendered violations against a committed baseline. New violations fail CI;
// resolved violations must be removed from the baseline. The baseline is the
// "triage, don't red-wall" mechanism borrowed from sam-styles and ngx-uswds:
// the pre-existing backlog is recorded, not blocking, and is burned down over
// time by deleting fingerprints as components are fixed.
//
// Regenerate the baseline after an intentional change with:
//   UPDATE_A11Y_BASELINE=1 npm run test:a11y

const WCAG_21_AA_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
const BASELINE_PATH = join(__dirname, "wcag-2.1-aa-baseline.json");
const APP_MODULE_PATH = join(
  __dirname,
  "..",
  "..",
  "src",
  "app",
  "app.module.ts"
);

interface AxeNode {
  target: string[];
}

interface AxeViolation {
  id: string;
  nodes: AxeNode[];
}

// test-app has no Storybook index; its pages are the gallery routes wired in
// `app.module.ts` (one route per component under test, per AGENTS.md). Read
// the route table from source so a new gallery route is scanned automatically
// and can never silently bypass the gate.
function testAppRoutes(): string[] {
  const source = readFileSync(APP_MODULE_PATH, "utf8");
  const routes = [...source.matchAll(/\{\s*path:\s*"([^"]*)"/g)].map(
    ([, path]) => `/${path}`
  );
  return [...new Set(routes)].sort();
}

// Angular stamps view-encapsulation classes (`ng-tns-c<hash>-<index>`) and
// content/host attributes (`_ngcontent-*`, `_nghost-*`) into rendered markup.
// Their hashes and indices shift with unrelated compilation or instance-order
// changes, so leaving them in a committed fingerprint makes the same violation
// churn as simultaneously "new" and "resolved". Strip them so a fingerprint is
// stable across builds.
function normalizeTarget(selector: string): string {
  return selector
    .replace(/\.ng-tns-c\d+-\d+/g, "")
    .replace(/\[_ngcontent-[^\]]+\]/g, "")
    .replace(/\[_nghost-[^\]]+\]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function violationFingerprints(
  route: string,
  violations: AxeViolation[]
): string[] {
  return violations.flatMap((violation) =>
    violation.nodes.map((node) =>
      [route, violation.id, ...node.target.map(normalizeTarget)].join(" | ")
    )
  );
}

test("axe detects a rendered WCAG 2.1 AA violation", async ({ page }) => {
  // Sanity check: prove the harness actually reports contrast failures, so a
  // green route run means "no violations" and never "axe silently did nothing".
  await page.setContent(
    '<main><p style="color:#aaa;background:#fff">Text</p></main>'
  );

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_21_AA_TAGS)
    .analyze();

  expect(results.violations.map(({ id }) => id)).toContain("color-contrast");
});

test("test-app routes have no unresolved WCAG 2.1 AA violations", async ({
  context,
}) => {
  const routes = testAppRoutes();
  expect(
    routes,
    "app.module.ts should declare at least the home route"
  ).toContain("/");

  const fingerprints: string[] = [];
  for (const route of routes) {
    // Fresh page per route: a clean frame with no carried-over render/axe state
    // from the previous iteration.
    const routePage = await context.newPage();
    try {
      await routePage.goto(route);
      await expect(
        routePage.locator("app-root h1").first(),
        `${route} should finish rendering`
      ).toBeVisible();

      const results = await new AxeBuilder({ page: routePage })
        .withTags(WCAG_21_AA_TAGS)
        .analyze();

      fingerprints.push(
        ...violationFingerprints(route, results.violations as AxeViolation[])
      );
    } finally {
      await routePage.close();
    }
  }

  const current = [...new Set(fingerprints)].sort();

  if (process.env.UPDATE_A11Y_BASELINE === "1") {
    writeFileSync(BASELINE_PATH, `${JSON.stringify(current, null, 2)}\n`);
  }

  const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8")) as string[];
  const baselineSet = new Set(baseline);
  const currentSet = new Set(current);
  const newViolations = current.filter(
    (fingerprint) => !baselineSet.has(fingerprint)
  );
  const resolvedViolations = baseline.filter(
    (fingerprint) => !currentSet.has(fingerprint)
  );

  expect(
    newViolations,
    "New WCAG 2.1 A/AA violations (fix them; do not update the baseline)"
  ).toEqual([]);
  expect(
    resolvedViolations,
    "Resolved WCAG 2.1 A/AA violations (remove them from the baseline with UPDATE_A11Y_BASELINE=1)"
  ).toEqual([]);
});

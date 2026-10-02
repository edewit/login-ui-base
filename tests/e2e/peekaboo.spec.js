import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("peekaboo bear offline preview", () => {
  test("login form renders and bear hides on password focus", async ({
    page,
  }) => {
    await page.goto("/?page=login");

    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    const bear = page.getByTestId("peekaboo-bear");
    await expect(bear).toBeVisible();
    await expect(bear).not.toHaveClass(/is-hiding/);

    await page.locator("#password").focus();
    await expect(bear).toHaveClass(/is-hiding/);

    await page.locator("#username").focus();
    await expect(bear).not.toHaveClass(/is-hiding/);
  });

  test("login page has no critical a11y violations", async ({ page }) => {
    await page.goto("/?page=login");
    await expect(page.locator("#password")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
});

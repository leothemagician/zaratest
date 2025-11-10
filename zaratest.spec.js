import {test, exec, expect} from "@playwright/test";
import locators from "./locators";


test.describe("Zara test", () =>   {

    test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
    await page.locator(locators.loginbtn).toBeVisible();
    })

    test("Login Positive Credentials", async ({ page }) => {    
    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.locator(locators.loginbtn).click();
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator(locators.inventorylist)).toBeVisible();
    })

    test("Login Negative", async ({ page }) => {
    await page.fill("#user-name", "leonard-mustafa");
    await page.fill("#password", "leo123");
    await page.locator(locators.loginbtn).click();
    await expect(page.locator(locators.errorlogin)).toBeVisible();
    })


})
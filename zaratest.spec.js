import {test, exec, expect} from "@playwright/test";
import locators from "./locators";


test.describe("Zara test", () =>   {

    test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
    //await page.locator(locators.loginbtn).toBeVisible();
    })

    test("Login Positive Credentials", async ({ page }) => {

    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.locator(locators.loginbtn).click();
    await expect(page).toHaveURL(/inventory.html/);
    await page.waitForSelector(locators.inventorylist);
    await expect(page.locator(locators.inventorylist)).toBeVisible();
    })

    test("Login Negative", async ({ page }) => {
    await page.fill("#user-name", "leonard-mustafa");
    await page.fill("#password", "leo123");
    await page.locator(locators.loginbtn).click();
    await expect(page.locator(locators.errorlogin)).toBeVisible();
    })

    // Login si standard_user.
    // Në faqen e produkteve, klik Add to cart për një produkt (p.sh. Sauce Labs Backpack).
    // Kliko ikonën e shportës (Cart) dhe hap Your Cart. Verifiko që produkti ekziston dhe 
    // çmimi është i saktë.
    // Kliko Checkout → plotëso First Name, Last Name, Postal Code → Continue → Finish.
    // Verifiko që shfaqet konfirmimi THANK YOU FOR YOUR ORDER.
    test("Add to cart, checkout", async ({ page }) => {
        await page.fill("#user-name", "standard_user");
        await page.fill("#password", "secret_sauce");
        await page.locator(locators.loginbtn).click();
        await page.waitForURL(/inventory.html/);
        await expect(page).toHaveURL(/inventory.html/);
        await page.locator(locators.slbackpack).click();
        await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
        await page.locator(".shopping_cart_link").click();
        await expect(page.locator(locators.inventoryitem)).toBeVisible();
        const item = await page.locator(locators.cartItem);
        await expect(item).toContainText("Sauce Labs Backpack");
        await expect(item).toContainText("29.99");
        await page.locator("#checkout").click();
        await page.fill("#first-name", "Leonard");
        await page.fill("#last-name", "Mustafa");
        await page.fill("#postal-code", "12050");
        await page.locator(locators.continue).click();
        await page.waitForURL(/checkout-step-two.html/);
        await expect(page).toHaveURL(/checkout-step-two.html/);
        await page.locator(locators.finish).click();
        await page.waitForURL(/checkout-complete.html/);
        await expect(page).toHaveURL(/checkout-complete.html/);
        const complete = await page.locator(locators.checkoutcomplete);
        expect(complete).toContainText("Thank you for your order!");
    })

// Hap faqen e inventory.html (pas login).
// Kontrollo tre viewport-e:
// Desktop: 1280x720
// Tablet: 768x1024
// Mobile: 375x812
// Për secilin viewport:
// Verifiko që menu kryesore / logo / butonat e produktit janë të dukshëm dhe nuk overflow-ojnë.
// Në mobile: kontrollo që butoni për shportë (.shopping_cart_link) është i dukshëm dhe i klikueshëm.
// Accessibility basics:
// Kontrollo që nav ka role="navigation" (nëse ekziston) ose që butonët kryesorë kanë aria-label 
// ku e ka kuptimin.

test("Kontrollo viewportat", async ({ page }) => {
    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.locator(locators.loginbtn).click();
    await page.waitForURL(/inventory.html/);
    await expect(page).toHaveURL(/inventory.html/);
    
    //Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator(locators.inventorylist)).toBeVisible();
    await expect(page.locator(".title")).toBeVisible();
    const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > 
    window.innerWidth);
    expect(desktopOverflow).toBe(false);
    
    //Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("div[data-test='primary-header']")).toContainText("Swag Labs");
    const tabletOverflow = await page.evaluate(() => document.documentElement.scrollWidth > 
    window.innerWidth);
    expect(tabletOverflow).toBe(false);

    //Mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator(locators.inventorylist)).toBeVisible();
    const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > 
    window.innerWidth);
    expect(mobileOverflow).toBe(false);
})

})
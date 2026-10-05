const {
    Builder,
    By
} = require("selenium-webdriver");

jest.setTimeout(30000);

const seleniumUrl =
    process.env.SELENIUM_REMOTE_URL ||
    "http://localhost:4444/wd/hub";

const appUrl =
    process.env.APP_URL ||
    "http://localhost:4000";

describe("Task Tracker UI", () => {

    let driver;

    beforeAll(async () => {

        driver =
            await new Builder()
                .usingServer(seleniumUrl)
                .forBrowser("chrome")
                .build();

    });

    afterAll(async () => {

        if (driver) {
            await driver.quit();
        }

    });

    test("should display Task Tracker frontend", async () => {

        await driver.get(appUrl);

        const title =
            await driver.getTitle();

        expect(title)
            .toBe("Task Tracker");

        const heading =
            await driver.findElement(
                By.css("h1")
            );

       expect(await heading.getText())
          .toBe("Task Tracker CI/CD");

        const input =
            await driver.findElement(
                By.id("taskInput")
            );

        expect(await input.getAttribute("placeholder"))
            .toBe("Enter a task");

    });

});
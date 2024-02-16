import puppeteer from "puppeteer";

export const scrapeWebsite = async (url: string, parameter_obj: ScrapingConfigObject) => {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(url);

        const selectors = Object.values(parameter_obj);
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 10 * 1000));
        await Promise.race([Promise.all(selectors.map((selector) => page.waitForSelector(selector))), timeoutPromise]);

        const scrapedData = await page.evaluate(
            (parameter_obj, url) => {
                const results: ScrapingConfigObject = {};
                results["url"] = url;
                results["timestamp"] = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });

                Object.entries(parameter_obj).forEach(([key, selector]) => {
                    try {
                        const element = document.querySelector(selector);
                        const content = element ? element.textContent?.trim() || "" : "";
                        results[key] = { selector, content };
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : "Unknown error";
                        console.error("Error in scrapeWebsite:", error);
                        console.error(`Error scraping ${key}:`, errorMessage);
                        results[key] = { selector, error: errorMessage };
                    }
                });
                return results;
            },
            parameter_obj,
            url
        );
        return scrapedData;
    } catch (error) {
        console.error("Error in scrapeWebsite:", error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

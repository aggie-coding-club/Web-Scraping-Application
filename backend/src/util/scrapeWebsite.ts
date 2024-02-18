import puppeteer from "puppeteer";

function getScrapedData(selectorArray: SelectorArray, url: string): ScrapedData {
    const scrapedSelectorArray = selectorArray.map((selector: Selector) => {
        try {
            const element = document.querySelector(selector.value);
            const content = element ? element.textContent?.trim() || "" : "";
            console.log(content);
            return { ...selector, content };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("Error in scrapeWebsite:", error);
            console.error(`Error scraping ${selector.name} (${selector.value}):`, errorMessage);
            return { ...selector, error: errorMessage };
        }
    });

    const scrapedData: ScrapedData = {
        url,
        timestamp: Date.now(),
        selectors: scrapedSelectorArray,
    };

    return scrapedData;
}

export const scrapeWebsite = async (url: string, selectorArray: SelectorArray) => {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(url);

        const selectors = selectorArray.map((selector) => selector.value);
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 10 * 1000));
        await Promise.race([Promise.all(selectors.map((selector) => page.waitForSelector(selector))), timeoutPromise]);

        const scrapedData = await page.evaluate(getScrapedData, selectorArray, url);

        return scrapedData;
    } catch (error: any) {
        console.error("Error in scrapeWebsite:", error);
        throw Error(error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

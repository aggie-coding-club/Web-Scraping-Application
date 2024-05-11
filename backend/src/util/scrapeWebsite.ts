import puppeteer from "puppeteer";

function getScrapedData(
  selectorArray: SelectorMetadata[],
  url: string
): ScrapedData {
  const scrapedSelectorArray = selectorArray.map((selector) => {
    const timestamp = Date.now();
    try {
      const element = document.querySelector(selector.selectorValue);
      const content = element ? element.textContent?.trim() || "" : "";
      return { ...selector, content, timestamp };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error in scrapeWebsite:", error);
      console.error(
        `Error scraping ${selector.name} (${selector.selectorValue}):`,
        errorMessage
      );
      return { ...selector, error: errorMessage, timestamp };
    }
  });

  const scrapedData: ScrapedData = {
    url,
    timestamp: Date.now(),
    selectors: scrapedSelectorArray,
  };

  return scrapedData;
}

export const scrapeWebsite = async (
  url: string,
  selectorArray: SelectorMetadata[]
) => {
  console.log("scraping website");
  let browser;
  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url);

    const timeoutPromise = new Promise((resolve) =>
      setTimeout(resolve, 10 * 1000)
    );
    await Promise.race([
      Promise.all(
        selectorArray.map((selector) =>
          page.waitForSelector(selector.selectorValue)
        )
      ),
      timeoutPromise,
    ]);

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

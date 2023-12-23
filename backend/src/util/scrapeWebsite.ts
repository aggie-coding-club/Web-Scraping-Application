import puppeteer from "puppeteer";

export const scrapeWebsite = async (url: string, parameter_obj: ScrapingConfigObject) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const selectors = Object.values(parameter_obj);
  const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 10 * 1000));
  
  await Promise.race([
    Promise.all(selectors.map(selector => page.waitForSelector(selector))),
    timeoutPromise
  ])

  const scrapedData = await page.evaluate((params) => {
    const results: ScrapingConfigObject = {};
    Object.entries(params).forEach(([key, selector]) => {
      const element = document.querySelector(selector);
      const content = element ? element.textContent?.trim() || "" : "";
      results[key] = content;
    });
    return results;
  }, parameter_obj);

  await browser.close();
  return scrapedData;
};

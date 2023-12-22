import puppeteer from "puppeteer";
import { selectorsMap } from "../constants/selectorsMap";

export const scrapeWebsite = async (url: string, parameters: string[]) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const websiteName = Object.keys(selectorsMap).find((key) =>
    url.includes(key)
  );
  const selectors = websiteName ? selectorsMap[websiteName] : parameters;

  if (selectors.length === 0) {
    await browser.close();
    return [];
  }

  await Promise.all(selectors.map(selector => page.waitForSelector(selector)));

  const scrapedData = await page.evaluate((selectors: string[]) => {
    const results: string[] = [];
    selectors.forEach((selector) => {
      const content = document.querySelector(selector)?.textContent || "";
      results.push(content.trim());
    });
    return results;
  }, selectors);

  await browser.close();
  return scrapedData;
};
